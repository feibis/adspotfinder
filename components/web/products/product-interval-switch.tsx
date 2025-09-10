import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Ping } from "~/components/common/ping"
import type { ProductInterval } from "~/lib/products"
import { cx } from "~/lib/utils"

type Interval = {
  label: ReactNode
  value: string
  note?: ReactNode
}

type ProductIntervalSwitchProps = Omit<ComponentProps<"div">, "onChange"> & {
  intervals: Interval[]
  value: ProductInterval
  onChange: (value: ProductInterval) => void
}

export const ProductIntervalSwitch = ({
  className,
  intervals,
  value,
  onChange,
  ...props
}: ProductIntervalSwitchProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({ opacity: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLLabelElement | null)[]>([])

  const updateIndicator = useCallback(() => {
    const activeIndex = intervals.findIndex(interval => interval.value === value)
    const activeLabel = labelRefs.current[activeIndex]
    const container = containerRef.current

    if (activeLabel && container) {
      const containerRect = container.getBoundingClientRect()
      const labelRect = activeLabel.getBoundingClientRect()

      setIndicatorStyle({
        opacity: 1,
        width: `${labelRect.width}px`,
        transform: `translateX(${labelRect.left - containerRect.left - 2}px)`,
      })
    }
  }, [value, intervals])

  useEffect(() => {
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [updateIndicator])

  return (
    <div
      ref={containerRef}
      className={cx("relative flex rounded-md bg-foreground/10 p-0.5", className)}
      {...props}
    >
      <div
        className="absolute inset-0.5 bg-background rounded-sm will-change-transform transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />

      {intervals.map((interval, index) => (
        <label
          key={interval.value}
          ref={el => {
            labelRefs.current[index] = el
          }}
          className={cx(
            "relative z-10 flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium cursor-pointer transition",
            interval.value !== value && "opacity-60",
          )}
        >
          <input
            type="radio"
            value={interval.value}
            checked={interval.value === value}
            onChange={() => onChange(interval.value as ProductInterval)}
            className="peer sr-only"
          />

          {interval.label}

          {interval.note && <div className="ml-2 text-xs text-green-500">{interval.note}</div>}

          {interval.value === "year" && (
            <Ping className="absolute right-0 top-0 size-2.5 text-green-700/90 transition-opacity peer-checked:opacity-0 dark:text-green-300/90" />
          )}
        </label>
      ))}
    </div>
  )
}
