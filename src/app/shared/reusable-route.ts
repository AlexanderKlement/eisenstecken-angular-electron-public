export interface ReusableRoute {
  onAttach(): void;   // called when the cached component becomes visible again
  onDetach(): void;   // called right before the component is cached
}
