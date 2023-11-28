<template>
    <div class="w-full space-y-4">
        <form class="space-y-4" @submit="onResize">
            <div class="flex items-center justify-center w-full">
                <label for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p class="mb-2 text-sm text-gray-500">
                            <span class="font-semibold">Click to upload</span>
                        </p>
                        <p class="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" accept="image/*"
                        @change="(e: any) => { onFileSelect(e.target.files) }" />
                </label>
            </div>

            <div class="flex items-center gap-8">
                <NumberInput title="Width" class="w-1/2" :value="toWidthScaleString" :handleChange="onWidthSizeChange" />
                <NumberInput title="Height" class="w-1/2" :value="toHeightScaleString" :handleChange="onHeightSizeChange" />
                <CheckBox />
                <ResizeButton :disabled="isResizing" />
            </div>
            <hr>
        </form>
        <div v-if="workingImgSize && resizedImgSrc" class="rounded space-y-2">
            <div class="flex justify-between">
                <p class="font-medium">Resized</p>
                <div class="border w-8 h-8 grid place-items-center rounded-lg">
                    <button type="button" @click="downloadURL"><i class="fa fa-download" aria-hidden="true"></i></button>
                    <a ref="downloadRef" download="resized-image.png" @click="downloadURL"></a>
                </div>
            </div>
            <img :src="resizedImgSrc" :width="workingImgSize.w" :height="workingImgSize.h" alt="Resized" class="w-full" />
        </div>
        <FadeIn :class="['w-full mb-6 space-y-4', resizedImgSrc || !energyMap ? 'hidden' : '']">
            <p class="font-medium">Resizing Image</p>
            <div className="w-full overflow-scroll">
                <canvas ref="canvasRef"></canvas>
                <div v-if="workingImgSize && seams" :style="{ marginTop: `-${workingImgSize.h}px` }">
                    <Seams :seams="seams" :width="workingImgSize.w" :height="workingImgSize.h" />
                </div>
            </div>
        </FadeIn>
        <div class="rounded space-y-2" v-if="workingImgSize && energyMap">
            <!-- <EnergyMap :energyMap="energyMap" :width="workingImgSize.w" :height="workingImgSize.h" /> -->
            <!-- {seamsCanvas} -->
        </div>
        <div class="w-full rounded space-y-2">
            <div class="flex items-center gap-2">
                <p class="font-medium">Original</p>
                <div v-if="originalImgSize" className="text-xs text-gray-600 whitespace-nowrap">
                    {{ `${originalImgSize.w} x ${originalImgSize.h} px` }}
                </div>
            </div>
            <img :src="imageSrc" alt="Original" ref="imgRef" class="w-full" />
        </div>
    </div>

    <!-- <div v-if="imgAuthor && imgAuthorURL" class="text-xs text-gray-400 mt-2 flex justify-center items-center font-light">
        <div class="mr-1">Photo by</div>
        <a :href="imgAuthorURL" style="color: #aaa; font-weight: 300;" target="_blank" rel="noreferrer">
            {{ imgAuthor }}
        </a>
    </div> -->

    <div v-if="props.withSeam && workingImgSize && seams" :style="{ marginTop: `-${workingImgSize.h}px` }">
        <Seams :seams="seams" :width="workingImgSize.w" :height="workingImgSize.h" />
    </div>

    <!-- <span v-if="workingImgSize?.w && originalImgViewSize?.w && workingImgSize.w > originalImgViewSize.w"
        className="text-xs text-gray-400 ml-4">↔︎ scrollable</span> -->
</template>
  
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import defaultImgSrc from '../assets/02.jpg'
import {
    EnergyMap as EnergyMapType,
    Seam,
    OnIterationArgs,
    ImageSize,
    resizeImage,
    ALPHA_DELETE_THRESHOLD,
    MAX_WIDTH_LIMIT,
    MAX_HEIGHT_LIMIT,
} from '../utils/contentAwareResizer'
import { Coordinate, getPixel, setPixel } from '../utils/image';
import FileSelector from './FileSelector.vue';
import ButtonPrimary from './button/ButtonPrimary.vue';
import NumberInput from './input/NumberInput.vue';
import ResizeButton from './button/ResizeButton.vue';
import CheckBox from './input/CheckBox.vue';
import EnergyMap from './EnergyMap.vue';
import Seams from './Seams.vue';
import FadeIn from './FadeIn.vue';

const defaultWidthScale = 50;
const defaultHeightScale = 70;
const minScale = 1;
const maxScale = 100;
const maxWidthLimit = MAX_WIDTH_LIMIT;
const maxHeightLimit = MAX_HEIGHT_LIMIT;

type ImageResizerProps = {
    withSeam?: boolean
    withEnergyMap?: boolean
};

const props = defineProps<ImageResizerProps>()

const imgAuthor = ref<string | null>('ian dooley');
const imgAuthorURL = ref<string | null>(
    'https://unsplash.com/@sadswim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
);
const useNaturalSize = ref<boolean>(false);
const imageSrc = ref<string>(defaultImgSrc);
const resizedImgSrc = ref<string | null>(null);
const energyMap = ref<EnergyMapType | null>(null);
const originalImgSize = ref<ImageSize | null>(null);
const originalImgViewSize = ref<ImageSize | null>(null);
const workingImgSize = ref<ImageSize | null>(null);
const seams = ref<Seam[] | null>(null);
const isResizing = ref<boolean>(false);
const progress = ref<number>(0);
const maskImgData = ref<ImageData | null>(null);
const maskRevision = ref<number>(0);
const toWidthScale = ref<number>(defaultWidthScale);
const toWidthScaleString = ref<string | undefined>(`${defaultWidthScale}`);
const toHeightScale = ref<number>(defaultHeightScale);
const toHeightScaleString = ref<string | undefined>(`${defaultHeightScale}`);

const imgRef = ref<HTMLImageElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const onUseOriginalSizeChange = (state: boolean): void => {
    useNaturalSize.value = state
};

const onReset = (): void => {
    resizedImgSrc.value = null;
    seams.value = null;
    workingImgSize.value = null;
    energyMap.value = null;
    progress.value = 0;
    originalImgViewSize.value = null;
};

const onFileSelect = (files: FileList | null): void => {
    console.log(files)
    if (!files || !files.length) {
        return;
    }
    imgAuthor.value = null;
    imgAuthorURL.value = null;
    onReset();
    const imageURL = URL.createObjectURL(files[0]);
    imageSrc.value = imageURL;
};

const onWidthSizeChange = (size: string | undefined): void => {
    const radix = 10;
    const scale = Math.max(Math.min(parseInt(size || '0', radix), maxScale), minScale);
    if (size) {
        toWidthScaleString.value = `${scale}`;
    } else {
        toWidthScaleString.value = size;
    }
    toWidthScale.value = scale
};

const onHeightSizeChange = (size: string | undefined): void => {
    const radix = 10;
    const scale = Math.max(Math.min(parseInt(size || '0', radix), maxScale), minScale);
    if (size) {
        toHeightScaleString.value = `${scale}`
    } else {
        toHeightScaleString.value = size
    }
    toHeightScale.value = scale
};

const onFinish = (): void => {
    if (!canvasRef.value) {
        return;
    }
    const imageType = 'image/png';
    canvasRef.value.toBlob((blob: Blob | null): void => {
        if (!blob) {
            return;
        }
        const imgUrl = URL.createObjectURL(blob);
        resizedImgSrc.value = imgUrl
        isResizing.value = false
    }, imageType);
};

const onClearMask = (): void => {
    maskRevision.value = maskRevision.value + 1;
};

const onMaskDrawEnd = (imgData: ImageData): void => {
    maskImgData.value = imgData
};

const applyMask = (img: ImageData): void => {
    if (!maskImgData.value) {
        return;
    }

    const wRatio = maskImgData.value.width / img.width;
    const hRatio = maskImgData.value.height / img.height;

    const imgXYtoMaskXY = ({ x: imgX, y: imgY }: Coordinate): Coordinate => {
        return {
            x: Math.floor(imgX * wRatio),
            y: Math.floor(imgY * hRatio),
        };
    };

    for (let y = 0; y < img.height; y += 1) {
        for (let x = 0; x < img.width; x += 1) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [mR, mG, mB, mA] = getPixel(
                maskImgData.value,
                imgXYtoMaskXY({ x, y }),
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [iR, iG, iB, iA] = getPixel(img, { x, y });
            if (mA) {
                setPixel(img, { x, y }, [iR, iG, iB, ALPHA_DELETE_THRESHOLD]);
            }
        }
    }
};

const onIteration = async (args: OnIterationArgs): Promise<void> => {
    const {
        seam,
        img,
        energyMap: nrgMap,
        size: { w, h },
        step,
        steps,
    } = args;

    const canvas: HTMLCanvasElement | null = canvasRef.value;
    if (!canvas) {
        return;
    }

    canvas.width = w;
    canvas.height = h;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    ctx.putImageData(img, 0, 0, 0, 0, w, h);

    energyMap.value = nrgMap
    seams.value = [seam]
    workingImgSize.value = { w, h }
    progress.value = step / steps
};

const onResize = (e: Event): void => {
    e.preventDefault();

    const srcImg: HTMLImageElement | null = imgRef.value;
    if (!srcImg) return;

    const canvas: HTMLCanvasElement | null = canvasRef.value;
    if (!canvas) return;


    onReset();
    isResizing.value = true

    let w = useNaturalSize ? srcImg.naturalWidth : srcImg.width;
    let h = useNaturalSize ? srcImg.naturalHeight : srcImg.height;
    const ratio = w / h;

    originalImgViewSize.value = {
        w: srcImg.width,
        h: srcImg.height,
    }

    if (w > maxWidthLimit) {
        w = maxWidthLimit;
        h = Math.floor(w / ratio);
    }

    if (h > maxHeightLimit) {
        h = maxHeightLimit;
        w = Math.floor(h * ratio);
    }

    canvas.width = w;
    canvas.height = h;

    console.log(canvas);

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    ctx.drawImage(srcImg, 0, 0, w, h);

    const img: ImageData = ctx.getImageData(0, 0, w, h);

    applyMask(img);

    const toWidth = Math.floor((toWidthScale.value * w) / 100);
    const toHeight = Math.floor((toHeightScale.value * h) / 100);

    resizeImage({
        img,
        toWidth,
        toHeight,
        onIteration,
    }).then(() => {
        onFinish();
    });
}

watchEffect(() => {
    const srcImg: HTMLImageElement | null = imgRef.value;
    if (!srcImg) {
        return;
    }
    srcImg.addEventListener('load', () => {
        if (!imgRef.value) {
            return;
        }
        originalImgSize.value = {
            w: imgRef.value.naturalWidth,
            h: imgRef.value.naturalHeight,
        }
        originalImgViewSize.value = {
            w: imgRef.value.width,
            h: imgRef.value.height,
        }
    });
});

watchEffect(() => {
    function updateSize(): void {
        if (!imgRef.value) {
            return;
        }
        originalImgViewSize.value = {
            w: imgRef.value.width,
            h: imgRef.value.height,
        }
    }
    window.addEventListener('resize', updateSize);
    return (): void => {
        window.removeEventListener('resize', updateSize);
    };
});

const canImage = new Image()
canImage.src = imageSrc.value
canImage.onload = function () {
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// Santo
const downloadRef = ref<any>(null)
function downloadURL() {
    if (!canvasRef.value) return;
    canvasRef.value.toBlob((blob: Blob | null): void => {
        if (!blob) return;
        const imgUrl = URL.createObjectURL(blob);
        if (!downloadRef.value) return;
        downloadRef.value.href = imgUrl;
        downloadRef.value.click();
    }, 'image/png');
}
</script>
  