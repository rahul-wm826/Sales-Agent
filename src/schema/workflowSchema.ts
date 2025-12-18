import { AddressObject } from "mailparser";

export interface Email {
    from: string;
    subject: string | undefined;
    body: string;
}