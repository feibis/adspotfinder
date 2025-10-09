import components from "./components"
import notifications from "./notifications.json"
import templates from "./templates"
import wrapper from "./wrapper.json"

const emails = {
  components,
  notifications,
  templates,
  wrapper,
} as const

export default emails
