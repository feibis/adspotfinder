import { revalidatePath, revalidateTag } from "next/cache"

export type RevalidateOptions = {
  paths?: string[]
  tags?: string[]
  pathType?: "page" | "layout"
}

type RevalidateItem =
  | { type: "path"; value: string; revalidateType?: "page" | "layout" }
  | { type: "tag"; value: string }

class RevalidationQueue {
  private queue: RevalidateItem[] = []
  private processing = false

  add(item: RevalidateItem) {
    this.queue.push(item)
    this.process()
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    setTimeout(async () => {
      while (this.queue.length > 0) {
        const item = this.queue.shift()
        if (!item) continue

        try {
          if (item.type === "path") {
            revalidatePath(item.value, item.revalidateType)
          } else {
            revalidateTag(item.value)
          }
        } catch (error) {
          console.error(`Revalidation failed for ${item.type} "${item.value}":`, error)
        }
      }

      this.processing = false
    }, 0)
  }
}

const revalidationQueue = new RevalidationQueue()

/**
 * Queue a path for revalidation
 * @param path - The path to revalidate
 * @param type - The type of path to revalidate
 */
export const queueRevalidatePath = (path: string, type?: "page" | "layout") => {
  revalidationQueue.add({ type: "path", value: path, revalidateType: type })
}

/**
 * Queue a tag for revalidation
 * @param tag - The tag to revalidate
 */
export const queueRevalidateTag = (tag: string) => {
  revalidationQueue.add({ type: "tag", value: tag })
}

/**
 * Queue paths and tags for revalidation
 * @param paths - The paths to revalidate
 * @param tags - The tags to revalidate
 * @param pathType - The type of path to revalidate
 */
export const queueRevalidation = ({ paths, tags, pathType }: RevalidateOptions) => {
  for (const path of paths ?? []) {
    queueRevalidatePath(path, pathType)
  }

  for (const tag of tags ?? []) {
    queueRevalidateTag(tag)
  }
}
