import adDetails from "./ad_details.json"
import cta from "./cta.json"
import feedbackWidget from "./feedback_widget.json"
import media from "./media.json"
import signIn from "./sign_in.json"
import signOut from "./sign_out.json"

const forms = {
  ad_details: adDetails,
  cta,
  feedback_widget: feedbackWidget,
  media,
  sign_in: signIn,
  sign_out: signOut,
} as const

export default forms
