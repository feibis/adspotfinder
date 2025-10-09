import ads from "./ads.json"
import bottom from "./bottom.json"
import countBadge from "./count_badge.json"
import ctaProof from "./cta_proof.json"
import featureNudge from "./feature_nudge.json"
import featuredTools from "./featured_tools.json"
import listings from "./listings.json"
import pagination from "./pagination.json"
import plan from "./plan.json"
import posts from "./posts.json"
import price from "./price.json"
import tagListing from "./tag_listing.json"
import tags from "./tags.json"
import toolListing from "./tool_listing.json"
import toolSearch from "./tool_search.json"
import ui from "./ui.json"

const components = {
  ads,
  bottom,
  count_badge: countBadge,
  cta_proof: ctaProof,
  feature_nudge: featureNudge,
  featured_tools: featuredTools,
  listings,
  pagination,
  plan,
  posts,
  price,
  tags,
  tag_listing: tagListing,
  tool_listing: toolListing,
  tool_search: toolSearch,
  ui,
} as const

export default components
