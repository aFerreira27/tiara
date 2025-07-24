import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your AuthOptions with a required method called `authorized`
  function middleware (req) {
    // console.log(req.nextUrl.pathname)
    // console.log(req.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/', // Redirect to the homepage if not authenticated
    }
  }
)

export const config = {
  matcher: ["/dashboard", "/krowne-base", "/krowne-link", "/krowne-sync", "/spec-sheet-generator"],
}
