
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
import { writeClient } from "./sanity/lib/write-client"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image}, profile: { id, login, bio} }) {
      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id, })

      if(!existingUser){
        await writeClient.withConfig({ useCdn: false }).create({
          _type: 'author',
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || ""
        })
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile ) {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        })

        token.id = user?._id
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });

      return session;
    }
  }
})

// Safed TYPED

// import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
// import { client } from "./sanity/lib/client"
// import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
// import { writeClient } from "./sanity/lib/write-client"
// import type { GitHubProfile } from "next-auth/providers/github"

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [GitHub],
//   callbacks: {
//     async signIn({ user, profile }) {
//       if (!profile) return false

//       const {
//         id,
//         login,
//         bio,
//       } = profile as GitHubProfile

//       const existingUser = await client.fetch(
//         AUTHOR_BY_GITHUB_ID_QUERY,
//         { id }
//       )

//       if (!existingUser) {
//         await writeClient
//           .withConfig({ useCdn: false })
//           .create({
//             _type: "author",
//             githubId: id,
//             name: user.name,
//             username: login,
//             email: user.email,
//             image: user.image,
//             bio: bio ?? "",
//           })
//       }

//       return true
//     },

//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         const { id } = profile as GitHubProfile

//         const user = await client
//           .withConfig({ useCdn: false })
//           .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id })

//         if (user?._id) {
//           token.id = user._id
//         }
//       }

//       return token
//     },

//     async session({ session, token }) {
//       if (token.id) {
//         session.id = token.id
//       }

//       return session
//     },
//   },
// })
