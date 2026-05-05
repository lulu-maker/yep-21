from odoo import _, api, fields, models
from odoo.exceptions import ValidationError


class ContractorJobOrder(models.Model):
    _name = "contractor.job.order"
    _description = "Contractor Job Order"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "id desc"

    name = fields.Char(
        string="JO Number",
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: _("New"),
        tracking=True,
    )
    purchase_order_id = fields.Many2one("purchase.order", string="Purchase Order", tracking=True)
    project_id = fields.Many2one("project.project", string="Project", tracking=True)
    contractor_id = fields.Many2one("res.partner", string="Contractor", required=True, tracking=True)
    role_scope = fields.Text(string="Role Scope")
    position_title = fields.Char(string="Position Title", tracking=True)

    start_date = fields.Date(string="Start Date", tracking=True)
    end_date = fields.Date(string="End Date", tracking=True)
    remote_start_date = fields.Date(string="Remote Start Date")
    remote_end_date = fields.Date(string="Remote End Date")
    onground_start_date = fields.Date(string="On-ground Start Date")
    onground_end_date = fields.Date(string="On-ground End Date")
    event_date = fields.Date(string="Event Date")
    bump_in_date = fields.Date(string="Bump In Date")
    bump_out_date = fields.Date(string="Bump Out Date")

    country_of_residence = fields.Char(string="Country of Residence")
    nationality = fields.Char(string="Nationality")
    passport_number = fields.Char(string="Passport Number", groups="contractor_job_orders.group_job_order_hr")
    passport_expiry_date = fields.Date(string="Passport Expiry Date", groups="contractor_job_orders.group_job_order_hr")
    id_number = fields.Char(string="ID Number", groups="contractor_job_orders.group_job_order_hr")

    currency_id = fields.Many2one("res.currency", string="Currency", required=True, default=lambda self: self.env.company.currency_id.id)
    consultancy_fee = fields.Monetary(string="Consultancy Fee", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    salary_package_qr = fields.Monetary(string="Salary Package (QAR)", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    salary_package_other_currency = fields.Monetary(string="Salary Package (Other Currency)", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    per_diem = fields.Monetary(string="Per Diem", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    mobile_allowance = fields.Monetary(string="Mobile Allowance", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    transport_reimbursement = fields.Monetary(string="Transport Reimbursement", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    accommodation = fields.Monetary(string="Accommodation", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    car_rental = fields.Monetary(string="Car Rental", currency_field="currency_id", groups="contractor_job_orders.group_job_order_finance")
    total_amount = fields.Monetary(string="Total Amount", currency_field="currency_id", compute="_compute_totals", store=True)

    wht_percentage = fields.Float(string="WHT %", default=0.0, groups="contractor_job_orders.group_job_order_finance")
    net_payable = fields.Monetary(string="Net Payable", currency_field="currency_id", compute="_compute_totals", store=True)

    state = fields.Selection([
        ("draft", "Draft"),
        ("generated", "Generated"),
        ("sent", "Sent"),
        ("signed", "Signed"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ], string="Status", default="draft", tracking=True, index=True)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get("name", _("New")) == _("New"):
                vals["name"] = self.env["ir.sequence"].next_by_code("contractor.job.order") or _("New")
        return super().create(vals_list)

    @api.depends(
        "consultancy_fee",
        "salary_package_qr",
        "salary_package_other_currency",
        "per_diem",
        "mobile_allowance",
        "transport_reimbursement",
        "accommodation",
        "car_rental",
        "wht_percentage",
    )
    def _compute_totals(self):
        for rec in self:
            total = sum([
                rec.consultancy_fee,
                rec.salary_package_qr,
                rec.salary_package_other_currency,
                rec.per_diem,
                rec.mobile_allowance,
                rec.transport_reimbursement,
                rec.accommodation,
                rec.car_rental,
            ])
            rec.total_amount = total
            rec.net_payable = total - ((rec.wht_percentage or 0.0) / 100.0 * total)

    @api.constrains("start_date", "end_date")
    def _check_main_dates(self):
        for rec in self:
            if rec.start_date and rec.end_date and rec.start_date > rec.end_date:
                raise ValidationError(_("End Date must be after Start Date."))

    @api.constrains("remote_start_date", "remote_end_date", "onground_start_date", "onground_end_date")
    def _check_segment_dates(self):
        for rec in self:
            if rec.remote_start_date and rec.remote_end_date and rec.remote_start_date > rec.remote_end_date:
                raise ValidationError(_("Remote End Date must be after Remote Start Date."))
            if rec.onground_start_date and rec.onground_end_date and rec.onground_start_date > rec.onground_end_date:
                raise ValidationError(_("On-ground End Date must be after On-ground Start Date."))
