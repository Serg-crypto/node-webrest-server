

export class CreateTodoDto {

    private constructor(
        readonly text: string,
    ){}

    static create( props: {[key:string]: any} ): [string?, CreateTodoDto?] {
        const { text } = props;

        if(!text) return ['Text property required', undefined];

        return [undefined, new CreateTodoDto(text)];
    }

}