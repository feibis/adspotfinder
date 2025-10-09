import actionNudge from "./action_nudge.json"
import expediteNudge from "./expedite_nudge.json"
import featureNudge from "./feature_nudge.json"

const components = {
  action_nudge: actionNudge,
  expedite_nudge: expediteNudge,
  feature_nudge: featureNudge,
} as const

export default components
