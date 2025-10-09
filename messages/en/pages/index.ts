import about from "./about.json"
import advertise from "./advertise.json"
import auth from "./auth.json"
import blog from "./blog.json"
import categories from "./categories.json"
import error from "./error.json"
import notFound from "./not_found.json"
import submit from "./submit.json"
import tags from "./tags.json"

const pages = {
  about,
  advertise,
  auth,
  blog,
  categories,
  error,
  not_found: notFound,
  submit,
  tags,
} as const

export default pages
