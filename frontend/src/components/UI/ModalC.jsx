



export default function ModalC({ children }) {


    return (
        <>
            <div className=" z-[10000] bg-custom-rgba absolute top-0 left-0 w-[100%] h-full flex justify-center items-center  ">
                {children}
            </div>
        </>
    )
}



