import { useState, useEffect } from 'react'

export const useWindow = () => {
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

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
