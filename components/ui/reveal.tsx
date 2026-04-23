"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade"
  | "scale-up"
  | "blur-up"
  | "clip-up";

type RevealEasing = "smooth" | "spring" | "sharp" | "linear";

interface RevealProps<T extends ElementType = "div"> {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  easing?: RevealEasing;
  distance?: number;
  threshold?: number;
  rootMargin?: string;
  repeat?: boolean;
  as?: T;
}

const EASINGS: Record<RevealEasing, string> = {
  smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  sharp: "cubic-bezier(0.16, 1, 0.3, 1)",
  linear: "linear",
};

function getStyles(
  variant: RevealVariant,
  visible: boolean,
  distance: number,
): React.CSSProperties {
  const show: React.CSSProperties = {
    opacity: 1,
    transform: "translate3d(0,0,0) scale(1)",
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0%)",
  };

  if (visible) return show;

  switch (variant) {
    case "fade-up":
      return { opacity: 0, transform: `translate3d(0,${distance}px,0)` };
    case "fade-down":
      return { opacity: 0, transform: `translate3d(0,-${distance}px,0)` };
    case "fade-left":
      return { opacity: 0, transform: `translate3d(${distance}px,0,0)` };
    case "fade-right":
      return { opacity: 0, transform: `translate3d(-${distance}px,0,0)` };
    case "fade":
      return { opacity: 0 };
    case "scale-up":
      return {
        opacity: 0,
        transform: `translate3d(0,${distance * 0.5}px,0) scale(0.92)`,
      };
    case "blur-up":
      return {
        opacity: 0,
        transform: `translate3d(0,${distance * 0.6}px,0)`,
        filter: "blur(12px)",
      };
    case "clip-up":
      return {
        opacity: 0,
        clipPath: `inset(0% 0% 100% 0%)`,
        transform: `translate3d(0,${distance * 0.4}px,0)`,
      };
    default:
      return { opacity: 0, transform: `translate3d(0,${distance}px,0)` };
  }
}

export const Reveal = forwardRef(
  <T extends ElementType = "div">(
    {
      children,
      className,
      variant = "fade-up",
      delay = 0,
      duration = 680,
      easing = "sharp",
      distance = 28,
      threshold = 0.08,
      rootMargin = "0px 0px -32px 0px",
      repeat = false,
      as,
    }: RevealProps<T>,
    forwardedRef: React.Ref<Element>,
  ) => {
    const Tag = (as || "div") as ElementType;

    const internalRef = useRef<Element | null>(null);

    // merge ref
    const setRef = (node: Element | null) => {
      internalRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<Element | null>).current = node;
      }
    };

    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const id = setTimeout(() => setVisible(true), delay);
            if (!repeat) observer.unobserve(el);
            return () => clearTimeout(id);
          } else if (repeat) {
            setVisible(false);
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [delay, threshold, rootMargin, repeat]);

    const hidden = getStyles(variant, false, distance);
    const shown = getStyles(variant, true, distance);

    const style: React.CSSProperties = {
      ...(visible ? shown : hidden),
      transition: [
        `opacity ${duration}ms ${EASINGS[easing]}`,
        variant !== "fade" && `transform ${duration}ms ${EASINGS[easing]}`,
        variant === "blur-up" && `filter ${duration}ms ${EASINGS[easing]}`,
        variant === "clip-up" && `clip-path ${duration}ms ${EASINGS[easing]}`,
      ]
        .filter(Boolean)
        .join(", "),
      willChange: visible ? "auto" : "opacity, transform",
    };

    return (
      <Tag ref={setRef} className={cn(className)} style={style}>
        {children}
      </Tag>
    );
  },
);

Reveal.displayName = "Reveal";

interface RevealGroupProps<T extends ElementType = "div"> {
  children: ReactNode | ReactNode[];
  className?: string;
  itemClassName?: string;
  variant?: RevealVariant;
  initialDelay?: number;
  stagger?: number;
  duration?: number;
  easing?: RevealEasing;
  distance?: number;
  as?: T;
  itemAs?: ElementType;
}

export function RevealGroup<T extends ElementType = "div">({
  children,
  className,
  itemClassName,
  variant = "fade-up",
  initialDelay = 0,
  stagger = 80,
  duration = 600,
  easing = "sharp",
  distance = 24,
  as,
  itemAs = "div",
}: RevealGroupProps<T>) {
  const Wrapper = (as || "div") as ElementType;

  return (
    <Wrapper className={cn(className)}>
      {(Array.isArray(children) ? children : [children]).map((child, i) => (
        <Reveal
          key={i}
          as={itemAs}
          className={itemClassName}
          variant={variant}
          delay={initialDelay + i * stagger}
          duration={duration}
          easing={easing}
          distance={distance}
        >
          {child}
        </Reveal>
      ))}
    </Wrapper>
  );
}
