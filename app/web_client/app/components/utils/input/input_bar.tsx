import "./input_bar.css"

interface Props
{
    label: string
    labelClassName?: string
    inputClassName?: string
    placeholder?: string
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export default function InputBar(props: Props)
{
    const label_class_name: string = props.labelClassName || "" ;
    const input_class_name: string = props.inputClassName || "" ;


    return (
        <>
            <label className={label_class_name}>
                {props.label}
                <input
                    type={props.type || "text"}
                    placeholder={props.placeholder}
                    className={input_class_name}
                    value={props.value}
                    onChange={props.onChange}
                />
            </label>
        </>
    )       
}