import adminSubmissionPremium from "./admin_submission_premium.json"
import magicLink from "./magic_link.json"
import submission from "./submission.json"
import submissionPremium from "./submission_premium.json"
import submissionPublished from "./submission_published.json"
import submissionScheduled from "./submission_scheduled.json"
import verifyDomain from "./verify_domain.json"

const templates = {
  admin_submission_premium: adminSubmissionPremium,
  magic_link: magicLink,
  submission,
  submission_premium: submissionPremium,
  submission_published: submissionPublished,
  submission_scheduled: submissionScheduled,
  verify_domain: verifyDomain,
} as const

export default templates
