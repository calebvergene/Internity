// src/types/react-window.d.ts
declare module 'react-window' {
    import * as React from 'react';
  
    export interface ListChildComponentProps<T = any> {
      index: number;
      style: React.CSSProperties;
      data: T;
      isScrolling?: boolean;
    }
  
    export interface FixedSizeListProps<T = any> {
      children: React.ComponentType<ListChildComponentProps<T>>;
      className?: string;
      height: number;
      itemCount: number;
      itemSize: number;
      layout?: 'horizontal' | 'vertical';
      width: number;
      direction?: 'ltr' | 'rtl';
      initialScrollOffset?: number;
      overscanCount?: number;
      useIsScrolling?: boolean;
      outerElementType?: React.ElementType;
      innerElementType?: React.ElementType;
      innerRef?: React.Ref<any>;
      itemKey?: (index: number, data: T) => any;
      onItemsRendered?: (props: {
        overscanStartIndex: number;
        overscanStopIndex: number;
        visibleStartIndex: number;
        visibleStopIndex: number;
      }) => any;
      onScroll?: (props: {
        scrollDirection: 'forward' | 'backward';
        scrollOffset: number;
        scrollUpdateWasRequested: boolean;
      }) => any;
      style?: React.CSSProperties;
    }
  
    export class FixedSizeList<T = any> extends React.PureComponent<
      FixedSizeListProps<T>
    > {}
  }
  