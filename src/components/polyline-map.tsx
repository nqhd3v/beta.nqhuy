import { polylinePoints2SVG } from '@/utils/mapping'
import React, { useMemo } from 'react'

interface iPolylineMap {
  path: string;
  size?: [number, number] | number;
}
const PolylineMap: React.FC<iPolylineMap> = ({ path, size = 80 }) => {
  const { points, width, height } = useMemo(() => polylinePoints2SVG(path, Array.isArray(size) ? [size[0] - 8, size[1] - 8] : size - 8), [path])

  return (
    <div className="p-1 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <polyline points={points} className="fill-none stroke-[3px] stroke-orange-500 dark:stroke-white" />
      </svg>
    </div>
  )
}

export default PolylineMap
