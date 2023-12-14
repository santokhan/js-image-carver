<template>
    <canvas ref="canvasRef" :width="width" :height="height" style="{touch-action: none}"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const defaultBackgroundColor = 'rgba(0, 0, 0, 0)';

type MouseCoordinate = {
    x: number;
    y: number;
};

type CanvasLineJoin = 'round' | 'bevel' | 'miter';

type MaskProps = {
    disabled: boolean;
    width: number;
    height: number;
    lineWidth: number;
    lineJoin: CanvasLineJoin;
    lineColor: string;
    backgroundColor: string;
    revision: number;
    onDrawEnd: (imageData: ImageData) => void;
};

// const {
//     disabled = false,
//     width = 200,
//     height = 200,
//     lineColor = 'rgba(255, 0, 0, 1)',
//     lineWidth = 16,
//     lineJoin = 'round',
//     backgroundColor = defaultBackgroundColor,
//     revision = 0,
//     onDrawEnd: onDrawEndCallback
// } = defineProps<MaskProps>()

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 200,
    },
    height: {
        type: Number,
        default: 200,
    },
    lineWidth: {
        type: Number,
        default: 16,
    },
    lineJoin: {
        type: String,
        default: 'round',
    },
    lineColor: {
        type: String,
        default: 'rgba(255, 0, 0, 1)',
    },
    backgroundColor: {
        type: String,
        default: defaultBackgroundColor,
    },
    revision: {
        type: Number,
        default: 0,
    },
    onDrawEnd: {
        type: Function,
    },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isPainting = ref<boolean>(false);
const mousePosition = ref<MouseCoordinate | null>(null);

const getCoordinates = (event: MouseEvent): MouseCoordinate | null => {
    if (!canvasRef.value) return null;

    const canvas: HTMLCanvasElement = canvasRef.value;

    return {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop,
    };
};

const startPaint = (event: MouseEvent) => {
    if (props.disabled) return;

    const coordinates = getCoordinates(event);
    if (coordinates) {
        mousePosition.value = coordinates;
        isPainting.value = true;
    }
}

const paint = (event: MouseEvent) => {
    const drawLine = (originalMousePosition: MouseCoordinate, newMousePosition: MouseCoordinate): void => {
        if (!canvasRef.value || props.disabled) return;
        const canvas: HTMLCanvasElement = canvasRef.value;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = props.lineColor;
            context.lineJoin = props.lineJoin as CanvasLineJoin;
            context.lineWidth = props.lineWidth;
            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();
            context.stroke();
        }
    };

    if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition.value && newMousePosition) {
            drawLine(mousePosition.value, newMousePosition);
            mousePosition.value = newMousePosition;
        }
    }
}

const exitPaint = () => {
    const onDrawEnd = (): void => {
        if (!canvasRef.value || props.disabled) return;

        const canvas: HTMLCanvasElement = canvasRef.value;
        const context = canvas.getContext('2d');

        // Call a callback.
        if (props.onDrawEnd && context) {
            props.onDrawEnd(context.getImageData(0, 0, canvas.width, canvas.height));
        }
    };

    onDrawEnd();
    isPainting.value = false;
    mousePosition.value = null;
}

// Effect for MouseDown.
onMounted(() => {
    if (!canvasRef.value) return (): void => { };

    const canvas: HTMLCanvasElement = canvasRef.value;
    canvas.addEventListener('mousedown', startPaint);
    // @ts-ignore
    canvas.addEventListener('touchstart', startPaint);

    return (): void => {
        canvas.removeEventListener('mousedown', startPaint);
        // @ts-ignore
        canvas.removeEventListener('touchstart', startPaint);
    };
})

// Effect for MouseMove.
onMounted(() => {
    if (!canvasRef.value) return (): void => { };

    const canvas: HTMLCanvasElement = canvasRef.value;
    canvas.addEventListener('mousemove', paint);
    // @ts-ignore
    canvas.addEventListener('touchmove', paint);

    return (): void => {
        canvas.removeEventListener('mousemove', paint);
        // @ts-ignore
        canvas.removeEventListener('touchmove', paint);
    };
})

// Effect for MouseMove.
onMounted(() => {
    if (!canvasRef.value) return (): void => { };

    const canvas: HTMLCanvasElement = canvasRef.value;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    canvas.addEventListener('touchend', exitPaint);
    canvas.addEventListener('touchcancel', exitPaint);

    return (): void => {
        canvas.removeEventListener('mouseup', exitPaint);
        canvas.removeEventListener('mouseleave', exitPaint);
        canvas.removeEventListener('touchend', exitPaint);
        canvas.removeEventListener('touchcancel', exitPaint);
    };
})

// ✅✅
// Effect for filling a canvases with color.
watch(() => props.backgroundColor, () => {
    if (!canvasRef.value) return;

    const canvas: HTMLCanvasElement = canvasRef.value;
    const context = canvas.getContext('2d');
    if (context) {
        context.fillStyle = props.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
});

// Effect to cleanup the canvas.
watch(() => props.revision, () => {
    console.log(props.revision);
    if (!canvasRef.value) return;

    const canvas: HTMLCanvasElement = canvasRef.value;
    const context = canvas.getContext('2d');
    if (context) {
        context.fillStyle = props.backgroundColor;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
});
</script>