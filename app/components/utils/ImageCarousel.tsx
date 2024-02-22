import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ImageCarousel({
    images,
}: {
    images: string[] | undefined | null;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevSlide = () => {
        if (!images || images.length === 0) {
            return;
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNextSlide = () => {
        if (!images || images.length === 0) {
            return;
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!images || images.length === 0) {
        return null;
    }
    return (
        <div className="overflow-hidden relative w-full h-72">
            <img
                draggable={false}
                src={images[currentIndex]}
                alt="carousel"
                className="select-none object-cover w-full h-full"
            />
            <button
                onClick={goToPrevSlide}
                className="btn btn-neutral btn-circle select-none absolute top-1/2 left-4 z-10"
            >
                <ArrowLeft />
            </button>
            <button
                onClick={goToNextSlide}
                className="btn btn-neutral btn-circle  select-none absolute top-1/2 right-4 z-10 "
            >
                <ArrowRight />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`${
                            index === currentIndex ? "bg-white" : "bg-gray-300"
                        } w-4 h-4 rounded-full mx-1
                        `}
                    ></div>
                ))}
            </div>
        </div>
    );
}
