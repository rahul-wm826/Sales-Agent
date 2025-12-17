import { NextFunction, Request, Response, Router } from "express";
import { mockPeople } from "../apollo/peopleApiSearch";
import { PeopleParams, PeopleParamsType, PeopleType } from "../schema/peopleSchema";
import parse from "../middleware/parse";

const router = Router();

export let people: PeopleType[] = [];

router.post('/', parse(PeopleParams), async (req: Request, res: Response) => {
    const filters: PeopleParamsType = req.body;

    const peopleData = await mockPeople(filters);

    if (!peopleData.success) {
        res.status(500).json({ error: 'Failed to fetch people data' });
        return;
    }

    if (peopleData.data) {
        people = peopleData.data.people.filter(person => person.has_email);
    }
    res.status(200).json(peopleData.data);
});

export const peopleRouter = router;