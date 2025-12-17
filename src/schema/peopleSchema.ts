import z from "zod";

export const PeopleParams = z.object({
    page: z.number(),
    per_page: z.number(),
    person_titles: z.string().optional(),
    include_similar_titles: z.boolean().optional(),
    q_keywords: z.string().optional(), // A string of words over which we want to filter the results.
    person_locations: z.string().optional(),
    person_seniorities: z.string().optional(),
    organization_locations: z.string().optional(),
    q_organization_domains_list: z.string().optional(), // Examples: apollo.io; microsoft.com
    contact_email_status: z.string().optional(),
    organization_ids: z.string().optional(),
    organization_num_employees_ranges: z.string().optional(),
    revenue_range_min: z.number().optional(),
    revenue_range_max: z.number().optional(),
    currently_using_all_of_technology_uids: z.string().optional(),
    currently_using_any_of_technology_uids: z.string().optional(),
    currently_not_using_any_of_technology_uids: z.string().optional(),
    q_organization_job_titles: z.string().optional(),
    organization_job_locations: z.string().optional(),
    organization_num_jobs_range_min: z.number().optional(),
    organization_num_jobs_range_max: z.number().optional(),
    organization_job_posted_at_range_min: z.date().optional(),
    organization_job_posted_at_range_max: z.date().optional(),
})

export const People = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name_obfuscated: z.string(),
    title: z.string().nullable(),
    last_refreshed_at: z.string(),
    has_email: z.boolean(),
    has_city: z.boolean(),
    has_state: z.boolean(),
    has_country: z.boolean(),
    has_direct_phone: z.string(),
    organization: z.object({
        name: z.string(),
        has_industry: z.boolean(),
        has_phone: z.boolean(),
        has_city: z.boolean(),
        has_state: z.boolean(),
        has_country: z.boolean(),
        has_zip_code: z.boolean(),
        has_revenue: z.boolean(),
        has_employee_count: z.boolean()
    })
})

export const PeopleData = z.object({
    total_entries: z.number(),
    people: People.array()
});

export type PeopleDataType = z.infer<typeof PeopleData>;
export type PeopleParamsType = z.infer<typeof PeopleParams>;
export type PeopleType = z.infer<typeof People>;