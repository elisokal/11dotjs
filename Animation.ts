namespace ElevenDotJs {
    export class Animation {
        public static byDuration(task: FrameRequestCallback, durationMs: number, fps: number) {
            const start = performance.now();
            const frameInterval = 1000 / fps; // Calculate the interval in milliseconds
            let lastFrameTime = start;

            function animationStep(now: number) {
                const elapsed = now - start;

                if (elapsed < durationMs) {
                    if (now - lastFrameTime >= frameInterval) {
                        task(now);
                        lastFrameTime = now;
                    }
                    requestAnimationFrame(animationStep);
                } else {
                    task(now);
                    console.log("Animation completed");
                }
            }

            requestAnimationFrame(animationStep);
        }

        public static byIterations(task: FrameRequestCallback, iterations: number, fps: number) {
            const frameInterval = 1000 / fps; // Calculate the interval in milliseconds
            let count = 0;
            let lastFrameTime = performance.now();

            function animationStep(now: number) {
                if (count < iterations) {
                    if (now - lastFrameTime >= frameInterval) {
                        task(now);
                        lastFrameTime = now;
                        count++;
                    }
                    requestAnimationFrame(animationStep);
                } else {
                    task(now);
                    console.log("Animation completed");
                }
            }

            requestAnimationFrame(animationStep);
        }
    }
}

