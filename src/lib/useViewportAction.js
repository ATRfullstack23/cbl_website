let intersectionObserver;

function ensureIntersectionObserver() {
    if (intersectionObserver) return;

    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const eventName = entry.isIntersecting ? 'enter_viewport' : 'exit_viewport';
                entry.target.dispatchEvent(new CustomEvent(eventName));
            });
        }
    );
}

export default function viewport(element) {
    ensureIntersectionObserver();



    intersectionObserver.observe(element);

    return {
        destroy() {
            intersectionObserver.unobserve(element);
        }
    }
}