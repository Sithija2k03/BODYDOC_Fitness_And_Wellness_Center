import { useState, useEffect } from 'react'

export const useWindow = () => {
    const [windowSize, setWindowSize] = useState([0, 0])

    useEffect(() => {
        const updateSize = () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        }
        window.addEventListener('resize', updateSize)
        
        return () => window.removeEventListener('resize', updateSize)
    }
    , [])

    return {
        width: windowSize[0],
        height: windowSize[1]
    }

}
