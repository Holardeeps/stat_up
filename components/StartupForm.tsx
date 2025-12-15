"use client"

import { useActionState, useState } from 'react';

import { Input } from "./ui/input"
import { Textarea } from './ui/textarea';
import MDEditor from "@uiw/react-md-editor"
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { Spinner } from './ui/spinner';
import { formSchema } from '@/lib/validation';
import { ZodError } from "zod"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/action';



const StartupForm = () => {

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("")
    const router = useRouter();

    const handleFormSubmit =  async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch,
            }

            await formSchema.parseAsync(formValues);

            const result = await createPitch(prevState, formData, pitch) 
            // console.log(result)

            if(result.status === "SUCCESS") {
                toast.success(<div>
                    <p className="font-semibold text-green-700">Success</p>
                    <p className="text-sm text-green-500">
                    Your startup pitch has been created successfully.
                    </p>
                </div>)
                router.push(`/startup/${result._id}`)
            }
            return result;

        } catch ( error ) {
            if (error instanceof ZodError) {
                const fieldErrors = error.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);

               toast.error(
                <div>
                    <p className="font-semibold text-red-700">Error</p>
                    <p className="text-sm text-red-600">
                    Please check your inputs and try again
                    </p>
                </div>
                )


                return { ...prevState, error: "Validation failed", status: "ERROR"}
            }

            toast.error(
                <div>
                    <p className="font-semibold text-red-700">Error</p>
                    <p className="text-sm text-red-600">
                    An unexpected error has occured
                    </p>
                </div>
                )

            return {
                ...prevState,
                error: "An unexpected error has occured",
                status: "ERROR"
            }
        }

    }
    const [ state, formAction, isPending ] = useActionState(
        handleFormSubmit, 
        {
            error: "",
            status: "INITIAL"
        } 
    );

    
  return (
    <form action={formAction} className="startup-form">
        <div className="">
            <label htmlFor="title" className="startup-form_label">Title</label>
            <Input
                id="title"
                name="title"
                className="startup-form_input"
                required
                placeholder="Startup Title"
             />
            { errors.title && <p className='startup-form_error italic text-lg '>{errors.title}</p>}
        </div>
        <div className="">
            <label htmlFor="description" className="startup-form_label">Description</label>
            <Textarea
                id="description"
                name="description"
                className="startup-form_textarea"
                required
                placeholder="Startup Description"
             />
            { errors.description && 
                <p className='startup-form_error italic text-lg '>{errors.description}</p>
            }
        </div>
        <div className="">
            <label htmlFor="category" className="startup-form_label">Title</label>
            <Input
                id="category"
                name="category"
                className="startup-form_input"
                required
                placeholder="Startup Category (Tech, Health, Education...)"
             />
            { errors.category && <p className='startup-form_error italic text-lg '>{errors.category}</p>}
        </div>
        <div className="">
            <label htmlFor="link" className="startup-form_label">Image URL</label>
            <Input
                id="link"
                name="link"
                className="startup-form_input"
                required
                placeholder="Startup Image URL"
             />
            { errors.link && <p className='startup-form_error italic text-lg '>{errors.link}</p>}
        </div>
        <div className="" data-color-mode="light" >
            <label htmlFor="pitch" className="startup-form_label">Pitch</label>
            <MDEditor
                value={pitch}
                onChange={(value) => setPitch(value as string)}
                id='pitch'
                preview='edit'
                height={300}
                style={{ borderRadius: 20, overflow: "hidden" }}
                textareaProps={{
                    placeholder: "Briefly describe your idea and what problem it solves"
                }}
                previewOptions={{
                    disallowedElements: ["style"]
                }}
             />
            { errors.pitch && <p className='startup-form_error italic text-lg '>{errors.pitch}</p>}
        </div>

        <Button
            type='submit'
            className='startup-form_btn hover:bg-[#ee2b69]! cursor-pointer hover:text-black'
            disabled={isPending}>
                {isPending ? (
  <>
    Submitting...
    <Spinner className="size-6 ml-2" />
  </>
) : (
  <>
    Submit your pitch...
    <Send className="size-6 ml-2" />
  </>
)}

                
            </Button>
    </form>
  )
}

export default StartupForm
