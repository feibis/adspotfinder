import WebLayout from "~/app/(web)/layout"
import WebNotFound from "~/app/(web)/not-found"

export default function () {
  return (
    <WebLayout params={Promise.resolve({})}>
      <WebNotFound />
    </WebLayout>
  )
}
