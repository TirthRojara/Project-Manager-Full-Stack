



export default function ModalLast({ children }) {


    return (
        <>
            <div className=" z-[10000] bg-custom-rgba absolute top-0 left-0 w-[100%] h-full flex justify-center items-center  ">
              <div className=" bg-[#e2e5eb] rounded-[6px] p-5 md:p-8 w-[400px] md:w-[30rem] relative bottom-8 md:bottom-0">
                  {children}
              </div>
            </div>
        </>
    )
}



