import z from "zod";

export const EnrichCommonParams = z.object({
    reveal_personal_emails: z.boolean().default(true),
    reveal_phone_number: z.boolean().optional(),
    webhook_url: z.string().optional()
});

export const EnrichCommonDetails = z.object({
    id: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    hashed_email: z.string().optional(),
    organization_name: z.string().optional(),
    domain: z.string().optional(),
    linkedin_url: z.string().optional(),
});

export const EnrichParams = EnrichCommonDetails.extend(EnrichCommonParams.shape);

const EmploymentHistorySchema = z.object({
    _id: z.string(),
    created_at: z.string().nullable(),
    current: z.boolean(),
    degree: z.string().nullable(),
    description: z.string().nullable(),
    emails: z.any().nullable(),
    end_date: z.string().nullable(),
    grade_level: z.string().nullable(),
    kind: z.string().nullable(),
    major: z.string().nullable(),
    organization_id: z.string().nullable(),
    organization_name: z.string(),
    raw_address: z.string().nullable(),
    start_date: z.string().nullable(),
    title: z.string(),
    updated_at: z.string().nullable(),
    id: z.string(),
    key: z.string()
});

const PhoneNumberSchema = z.object({
    raw_number: z.string(),
    sanitized_number: z.string(),
    type: z.string().nullable(),
    position: z.number(),
    status: z.string(),
    dnc_status: z.string().nullable(),
    dnc_other_info: z.string().nullable(),
    dialer_flags: z.object({
        country_name: z.string(),
        country_enabled: z.boolean(),
        high_risk_calling_enabled: z.boolean(),
        potential_high_risk_number: z.boolean()
    }).nullable()
});

const ContactEmailSchema = z.object({
    email: z.string(),
    email_md5: z.string(),
    email_sha256: z.string(),
    email_status: z.string(),
    email_source: z.string().nullable(),
    extrapolated_email_confidence: z.string().nullable(),
    position: z.number(),
    email_from_customer: z.boolean().nullable(),
    free_domain: z.boolean()
});

const ContactSchema = z.object({
    contact_roles: z.array(z.any()),
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    name: z.string(),
    linkedin_url: z.string(),
    title: z.string(),
    contact_stage_id: z.string(),
    owner_id: z.string().nullable(),
    creator_id: z.string(),
    person_id: z.string(),
    email_needs_tickling: z.any().nullable(),
    organization_name: z.string(),
    source: z.string(),
    original_source: z.string(),
    organization_id: z.string(),
    headline: z.string(),
    photo_url: z.string().nullable(),
    present_raw_address: z.string(),
    linkedin_uid: z.string().nullable(),
    extrapolated_email_confidence: z.string().nullable(),
    salesforce_id: z.string().nullable(),
    salesforce_lead_id: z.string().nullable(),
    salesforce_contact_id: z.string().nullable(),
    salesforce_account_id: z.string().nullable(),
    crm_owner_id: z.string().nullable(),
    created_at: z.string(),
    emailer_campaign_ids: z.array(z.any()),
    direct_dial_status: z.string().nullable(),
    direct_dial_enrichment_failed_at: z.string().nullable(),
    email_status: z.string(),
    email_source: z.string().nullable(),
    account_id: z.string(),
    last_activity_date: z.string().nullable(),
    hubspot_vid: z.string().nullable(),
    hubspot_company_id: z.string().nullable(),
    crm_id: z.string().nullable(),
    sanitized_phone: z.string(),
    merged_crm_ids: z.any().nullable(),
    updated_at: z.string(),
    queued_for_crm_push: z.any().nullable(),
    suggested_from_rule_engine_config_id: z.string().nullable(),
    email_unsubscribed: z.any().nullable(),
    label_ids: z.array(z.any()),
    has_pending_email_arcgate_request: z.boolean(),
    has_email_arcgate_request: z.boolean(),
    existence_level: z.string(),
    email: z.string(),
    email_from_customer: z.boolean(),
    typed_custom_fields: z.object({}),
    custom_field_errors: z.any().nullable(),
    crm_record_url: z.string().nullable(),
    email_status_unavailable_reason: z.string().nullable(),
    email_true_status: z.string(),
    updated_email_true_status: z.boolean(),
    contact_rule_config_statuses: z.array(z.any()),
    source_display_name: z.string(),
    contact_emails: z.array(ContactEmailSchema),
    time_zone: z.string(),
    phone_numbers: z.array(PhoneNumberSchema),
    account_phone_note: z.string().nullable(),
    free_domain: z.boolean(),
    is_likely_to_engage: z.boolean()
});

const FundingEventSchema = z.object({
    id: z.string(),
    date: z.string(),
    news_url: z.string().nullable(),
    type: z.string(),
    investors: z.string(),
    amount: z.string(),
    currency: z.string()
});

const TechnologySchema = z.object({
    uid: z.string(),
    name: z.string(),
    category: z.string()
});

const OrganizationSchema = z.object({
    id: z.string(),
    name: z.string(),
    website_url: z.string(),
    blog_url: z.string().nullable(),
    angellist_url: z.string().nullable(),
    linkedin_url: z.string(),
    twitter_url: z.string(),
    facebook_url: z.string(),
    primary_phone: z.object({}),
    languages: z.array(z.any()),
    alexa_ranking: z.number(),
    phone: z.string().nullable(),
    linkedin_uid: z.string(),
    founded_year: z.number(),
    publicly_traded_symbol: z.string().nullable(),
    publicly_traded_exchange: z.string().nullable(),
    logo_url: z.string(),
    crunchbase_url: z.string().nullable(),
    primary_domain: z.string(),
    industry: z.string(),
    keywords: z.array(z.string()),
    estimated_num_employees: z.number(),
    industries: z.array(z.string()),
    secondary_industries: z.array(z.any()),
    snippets_loaded: z.boolean(),
    industry_tag_id: z.string(),
    industry_tag_hash: z.record(z.string(), z.string()),
    retail_location_count: z.number(),
    raw_address: z.string(),
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
    owned_by_organization_id: z.string().nullable(),
    seo_description: z.string(),
    short_description: z.string(),
    suborganizations: z.array(z.any()),
    num_suborganizations: z.number(),
    annual_revenue_printed: z.string(),
    annual_revenue: z.number(),
    total_funding: z.number(),
    total_funding_printed: z.string(),
    latest_funding_round_date: z.string(),
    latest_funding_stage: z.string(),
    funding_events: z.array(FundingEventSchema),
    technology_names: z.array(z.string()),
    current_technologies: z.array(TechnologySchema),
    org_chart_root_people_ids: z.array(z.string()),
    org_chart_sector: z.string(),
    org_chart_removed: z.boolean(),
    org_chart_show_department_filter: z.boolean()
});

const EnrichPerson = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    name: z.string(),
    linkedin_url: z.string(),
    title: z.string(),
    email_status: z.string(),
    photo_url: z.string(),
    twitter_url: z.string().nullable(),
    github_url: z.string().nullable(),
    facebook_url: z.string().nullable(),
    extrapolated_email_confidence: z.string().nullable(),
    headline: z.string(),
    email: z.string(),
    organization_id: z.string(),
    employment_history: z.array(EmploymentHistorySchema),
    state: z.string(),
    city: z.string(),
    country: z.string(),
    contact_id: z.string(),
    contact: ContactSchema,
    revealed_for_current_team: z.boolean(),
    organization: OrganizationSchema,
    is_likely_to_engage: z.boolean(),
    intent_strength: z.string().nullable(),
    show_intent: z.boolean(),
    departments: z.array(z.string()),
    subdepartments: z.array(z.string()),
    functions: z.array(z.string()),
    seniority: z.string()
});

export const EnrichData = z.object({
    person: EnrichPerson
});

export const BulkEnrichData = z.object({
    status: z.string(),
    error_code: z.number().nullable(),
    error_message: z.string().nullable(),
    total_requested_enrichments: z.number(),
    unique_enriched_records: z.number(),
    missing_records: z.number(),
    credits_consumed: z.number(),
    matches: z.array(EnrichPerson)
})

export type EnrichDataType = z.infer<typeof EnrichData>;
export type EnrichParamsType = z.infer<typeof EnrichParams>;
export type BulkEnrichParamsType = z.infer<typeof EnrichCommonParams>;
export type BulkEnrichDetailsType = z.infer<typeof EnrichCommonDetails>;
export type BulkEnrichDataType = z.infer<typeof BulkEnrichData>;