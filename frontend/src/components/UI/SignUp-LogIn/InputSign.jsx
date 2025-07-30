


// export default function InputSign({ type, id, name, placeholder, title, ...props }) {
export default function InputSign({ type, id, name, placeholder, title, field, fieldState, isSubmitted, dirty, touched }) {


    return (
        <>
            <div>
                <label htmlFor={id} className="block mb-1 font-semibold">{title}</label>
                <input
                    // {...props}
                    {...field}
                    type={type}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    // required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {((isSubmitted && !dirty) || (touched && dirty)) && fieldState?.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}

            </div>
        </>
    )
}





