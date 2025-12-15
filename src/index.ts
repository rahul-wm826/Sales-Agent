import express from "express";
import { peopleRouter } from "./APIs/people";
import { enrichRouter } from "./APIs/enrich";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/people", peopleRouter);
app.use("/api/enrich", enrichRouter);

app.listen(3000, () => {
    console.log("Server running on: http://localhost:3000");
});
