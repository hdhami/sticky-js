class Sticky {
    constructor(options) {
        this.defaultSettings = {
            stickyAt: null,
            stickyNode: null,
            stickyClass: 'sticky-active',
            stickyWrap: null,
            avoidIntersection: null
        };
        this.offsetTop = 0;
        this.offsetLeft = 0;
        this.isSticky = false;
        this.intersectionMargin = 0;
        this.hasIntersected = false;
        this.enableSticky = true;

        this.settings = Object.assign(this.defaultSettings, options);
        this.trackNodePosition = this.trackNodePosition.bind(this);
        this.initSticky();
    }

    trackNodePosition() {
        if (this.timeout) {
            window.cancelAnimationFrame(this.timeout);
        }
        this.timeout = window.requestAnimationFrame(() => {
            if (this.settings.stickyWrap.getBoundingClientRect().top <= this.offsetTop) {
                this.makeSticky();
            } else {
                if (window.pageYOffset < this.offsetTopNode - this.offsetTop) {
                    this.removeStickyNess();
                }
            }
        });
    }
    boxStickyNode() {
        this.settings.stickyWrap.style.width = `${this.boxWidth}px`;
        this.settings.stickyWrap.style.height = `${this.boxHeight}px`;
    }
    unboxStickyNode() {
        this.settings.stickyWrap.style.width = '';
        this.settings.stickyWrap.style.height = '';
    }
    checkIntersection() {
        if (this.settings.avoidIntersection) {
            let intersectionIndicator = this.settings.avoidIntersection.getBoundingClientRect().top <= this.offsetTop + this.boxHeight + this.intersectionMargin;
            if (intersectionIndicator && !this.hasIntersected) {
                this.removeStickyNess();
                this.hasIntersected = true;
                this.enableSticky = false;
            } else if (!intersectionIndicator && this.hasIntersected) {
                this.hasIntersected = false, this.enableSticky = true;
            }
        }
    }
    makeSticky() {
        if (!this.isSticky && this.enableSticky) {
            this.settings.stickyNode.style.position = 'fixed';
            this.settings.stickyNode.style.top = `${this.offsetTop}px`;
            this.settings.stickyNode.style.left = `${this.offsetLeft}px`;
            this.settings.stickyNode.style.width = `${this.boxWidth}px`;
            this.settings.stickyNode.style.height = `${this.boxHeight}px`;
            this.boxStickyNode();
            this.isSticky = true;
        } else {
            this.checkIntersection();
        }
    }

    removeStickyNess() {
        if (this.isSticky) {
            this.settings.stickyNode.style.position = 'static';
            this.settings.stickyNode.style.top = '';
            this.settings.stickyNode.style.left = '';
            this.settings.stickyNode.style.width = '';
            this.settings.stickyNode.style.height = '';
            this.settings.stickyNode.style.WebkitTransition = 'all 2s ease-in';
            this.settings.stickyNode.style.transition = 'all 2s ease-in';
            this.unboxStickyNode();
            this.isSticky = false;
        }
    }

    destroy() {
        window.removeEventListener('scroll', this.trackNodePosition, false);
    }

    initSticky() {
        if (!this.settings.stickyNode || !this.settings.stickyWrap) {
            return;
        }
        this.offsetTop = this.settings.stickyAt ? this.settings.stickyAt.offsetHeight : 0;
        this.offsetLeft = this.settings.stickyNode.getBoundingClientRect().left;
        this.offsetTopNode = this.settings.stickyNode.offsetTop;
        this.boxHeight = this.settings.stickyNode.offsetHeight;
        this.boxWidth = this.settings.stickyNode.offsetWidth;
        window.addEventListener('scroll', this.trackNodePosition, false);
    }
}
export default Sticky;