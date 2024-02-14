import { ETipo } from "../interfaces";
import { ValidationException } from "./errors";

export function validateID(idStr: Record<"id", string>): number {    
    const id = parseInt(idStr.id || String(idStr));
    if (isNaN(id)) throw new ValidationException("[id] should be a number", 422);
    if (!Number.isInteger(id)) throw new ValidationException("[id] should be integer", 422);
    if (id <= 0) throw new ValidationException("[id] should be positive", 422);
    if (!id) throw new ValidationException("[id] is required", 422);
    if(id >= 6) throw new ValidationException("customer not found", 404);
    return id
}

export function validateValor(valor: number): number {    
    if (!valor) throw new ValidationException("[valor] is required", 422);    
    if (isNaN(valor)) throw new ValidationException("[valor] should be a number", 422);
    if (!Number.isInteger(valor)) throw new ValidationException("[valor] should be integer", 422);
    if (valor <= 0) throw new ValidationException("[valor] should be positive", 422);    
    return valor
}

export function validateTipo(tipo: ETipo): ETipo {
    if(!tipo) throw new ValidationException("[tipo] is required", 422);  
    if(tipo !== "c" && tipo !== "d") throw new ValidationException("[tipo] is not enum, should be  'c' or 'd'", 422);  
    return tipo
}

export function validateDescricao(descricao: string): string {     
    if(!descricao) throw new ValidationException("[descricao] is required", 422);  
    if(descricao.length < 1 || descricao.length > 10) throw new ValidationException("[description] must have a minimum of 1 character and a maximum of 10", 422);  
    return descricao
}