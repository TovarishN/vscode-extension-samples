//import Int64 = require('node-int64');
import { Message, FileChange, ObjectDescriptor } from './NitraMessages';
import { GetDeserializer } from './NitraDeserialize';

export type DesFun = (buf: Buffer, stack: DesFun[]) => DesFun[];

export function cast<To extends Message>(obj: Message): To {
    return <To>obj;
}

export function GetStringArrayDeserializer(arr: string[], index: number): DesFun[] {
    let retStack: DesFun[] = [];
    retStack.push((_buf, stack) => { return stack; });
    retStack.push((buf, stack) => { arr[index] = buf.toString(); return stack; });
    return retStack;
}


export function GetCompletionElemArrayDeserializer(arr: Message[], size: number): DesFun[] {
    let retStack: DesFun[] = [];
    PushRecurcive(arr, size, retStack);
     //for(let i = 0; i < size; i++)
     //{
    //     let curMsg: Message = <Message>{};
    //     retStack.push((buf, stack) => { 
    //         curMsg.MsgId = <Message["MsgId"]>buf.readInt16LE(0); 
    //         arr.push(curMsg);
    //         stack.push(...GetDeserializer(curMsg));
    //         return stack; 
    //     });
        
    //     // retStack.push((buf, stack) => { 
    //     //     stack.push(...GetDeserializer(curMsg)); return stack;
    //     // });
    //}
    return retStack;
}

function PushRecurcive(arr: Message[], sizeLeft: number, retStack: DesFun[]) : void {
    retStack.push((buf, stack) => {
        let curMsg: Message = <Message>{}; 
        curMsg.MsgId = <Message["MsgId"]>buf.readInt16LE(0); 
        arr.push(curMsg);
        stack.push(...GetDeserializer(curMsg));
        if(sizeLeft - 1 > 0)
            PushRecurcive(arr, sizeLeft-1, stack);
        return stack; 
    });
} 

export function GetFileChangeArrayDeserializer(arr: FileChange[], length: number) : DesFun[] {
    let ret: DesFun[] = [];
    for(let i = 0; i < length; i++) {
        ret.push((buf,stack) => { 
            let curMsg : Message = <Message>{};
            curMsg.MsgId = <Message["MsgId"]>buf.readInt16LE(0); 
            arr.push(<FileChange>curMsg);
            return stack; 
        });
        ret.push(...GetDeserializer(arr[i]))
    }

    return ret;
}

export function GetObjectDescriptorArrayDeserializer(arr: ObjectDescriptor[], length: number) : DesFun[] {
    let ret: DesFun[] = [];
    for(let i = 0; i < length; i++) {
        ret.push((buf,stack) => { 
            let curMsg : Message = <Message>{};
            curMsg.MsgId = <Message["MsgId"]>buf.readInt16LE(0); 
            arr.push(<ObjectDescriptor>curMsg);
            return stack; 
        });
        ret.push(...GetDeserializer(arr[i]))
    }

    return ret;
}

export function StringDeserializer(buf:Buffer, stack:DesFun[], setter : (str: string) => void, getter : () => string) : DesFun[] {

    let prevStack = stack;

    let newStack : DesFun[] = [];
    stack = newStack;

    let strFun = (buf : Buffer, stack : DesFun[], len : number) => { 
		var final = len - buf.toString().length;
		setter(getter() ? getter() + buf.toString() : buf.toString());
		if(final > 0)
            newStack.push((buf, st) => strFun(buf, st, final));
        else {
            stack = prevStack;
        }

        return stack;
	};

	let lenFun = ((buf:Buffer, stack:DesFun[], length: number, shift: number) => {
		let len = buf.readInt8(0);
		length = length | (len & 0x7f) << shift;
        if((len & 0x80) != 0){
			stack.push((buf: Buffer, stack: DesFun[]) => lenFun(buf, stack, length, shift + 7));
        }
        else if(len == 0 && shift == 0)
        {
            stack = prevStack;
        }
		else {
			stack.push((buf, st) => strFun(buf, st, length));
        }
        
        return stack;
	});

    return lenFun(buf, newStack, 0, 0);
}
