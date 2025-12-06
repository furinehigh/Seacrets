'use client'

import gsap from "gsap"
import { Application, Assets, Graphics, Sprite } from "pixi.js"
import { useEffect, useRef } from "react"

export default function OceanCanvas({ bottles, onBottleOpen }: any) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const app = new Application()
        app.init({
            backgroundAlpha: 0,
            resizeTo: ref.current!,
            preference: 'webgl'
        }).then(() => {
            ref.current!.appendChild(app.canvas)

            const ocean = new Graphics()
            ocean.rect(0, 0, app.screen.width, app.screen.height)
            ocean.fill({ color: 0x003355 })
            app.stage.addChild(ocean)

            bottles.forEach(async (bottle: any) => {
                const tex = await Assets.load('/bottle.png')
                const sprite = new Sprite(tex)

                sprite.anchor.set(.5)
                sprite.x = Math.random() * app.screen.width
                sprite.y = app.screen.height * .3 + Math.random() * (app.screen.height * .6)
                sprite.eventMode = 'static'
                sprite.cursor = 'pointer'

                sprite.on('pointerup', () => onBottleOpen(bottle))
                app.stage.addChild(sprite)

                gsap.to(sprite, {
                    duration: 6 + Math.random() * 4,
                    y: `+=${10 + Math.random() * 20}`,
                    rotation: Math.random() * 0.05,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut'
                })

            })
        })

        return () => app.destroy(true)

    }, [])

    return (
        <div 
            ref={ref}
            style={{width: '100vw', height: '50vh', overflow: 'hidden'}}
            
        />
    )
}