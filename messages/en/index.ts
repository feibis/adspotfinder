import ads from "./ads.json"
import brand from "./brand.json"
import common from "./common.json"
import components from "./components"
import counts from "./counts.json"
import dialogs from "./dialogs"
import emails from "./emails"
import emptyStates from "./empty_states.json"
import footer from "./footer.json"
import forms from "./forms"
import navigation from "./navigation.json"
import pages from "./pages"
import stats from "./stats.json"
import tools from "./tools"

const messages = {
  ads,
  brand,
  common,
  components,
  counts,
  dialogs,
  emails,
  empty_states: emptyStates,
  footer,
  forms,
  navigation,
  pages,
  stats,
  tools,
} as const

export default messages
