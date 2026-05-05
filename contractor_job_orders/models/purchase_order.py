from odoo import _, fields, models


class PurchaseOrder(models.Model):
    _inherit = "purchase.order"

    job_order_ids = fields.One2many("contractor.job.order", "purchase_order_id", string="Job Orders")
    contractor_line_ids = fields.One2many("purchase.order.contractor.line", "purchase_order_id", string="Contractor Lines")
    job_order_count = fields.Integer(compute="_compute_job_order_count")

    def _compute_job_order_count(self):
        grouped = self.env["contractor.job.order"].read_group(
            [("purchase_order_id", "in", self.ids)], ["purchase_order_id"], ["purchase_order_id"]
        )
        count_by_po = {item["purchase_order_id"][0]: item["purchase_order_id_count"] for item in grouped}
        for order in self:
            order.job_order_count = count_by_po.get(order.id, 0)

    def action_generate_job_orders(self):
        self.ensure_one()
        job_order_vals = []
        for line in self.contractor_line_ids:
            if not line.contractor_id:
                continue
            job_order_vals.append({
                "purchase_order_id": self.id,
                "project_id": line.project_id.id,
                "contractor_id": line.contractor_id.id,
                "role_scope": line.role_scope,
                "position_title": line.position_title,
                "start_date": line.start_date,
                "end_date": line.end_date,
                "currency_id": self.currency_id.id,
                "consultancy_fee": line.consultancy_fee,
                "salary_package_qr": line.salary_package,
                "per_diem": line.per_diem,
                "mobile_allowance": line.mobile_allowance,
                "transport_reimbursement": line.transport_reimbursement,
                "accommodation": line.accommodation,
                "car_rental": line.car_rental,
                "state": "generated",
                "country_of_residence": line.contractor_id.country_id.name,
                "nationality": line.contractor_id.nationality,
                "passport_number": line.contractor_id.passport_number,
                "passport_expiry_date": line.contractor_id.passport_expiry_date,
                "id_number": line.contractor_id.id_number,
            })
        created_records = self.env["contractor.job.order"].create(job_order_vals) if job_order_vals else self.env["contractor.job.order"]
        action = self.env.ref("contractor_job_orders.action_contractor_job_order").read()[0]
        action["domain"] = [("id", "in", created_records.ids)] if created_records else [("purchase_order_id", "=", self.id)]
        return action

    def action_view_job_orders(self):
        self.ensure_one()
        action = self.env.ref("contractor_job_orders.action_contractor_job_order").read()[0]
        action["domain"] = [("purchase_order_id", "=", self.id)]
        action["context"] = {"default_purchase_order_id": self.id}
        return action


class PurchaseOrderContractorLine(models.Model):
    _name = "purchase.order.contractor.line"
    _description = "Purchase Order Contractor Line"

    purchase_order_id = fields.Many2one("purchase.order", string="Purchase Order", required=True, ondelete="cascade")
    contractor_id = fields.Many2one("res.partner", string="Contractor", required=True)
    project_id = fields.Many2one("project.project", string="Project")
    position_title = fields.Char(string="Position Title")
    role_scope = fields.Text(string="Role Scope")
    start_date = fields.Date(string="Start Date")
    end_date = fields.Date(string="End Date")
    currency_id = fields.Many2one(related="purchase_order_id.currency_id", store=True)
    consultancy_fee = fields.Monetary(string="Consultancy Fee", currency_field="currency_id")
    salary_package = fields.Monetary(string="Salary Package", currency_field="currency_id")
    per_diem = fields.Monetary(string="Per Diem", currency_field="currency_id")
    mobile_allowance = fields.Monetary(string="Mobile Allowance", currency_field="currency_id")
    transport_reimbursement = fields.Monetary(string="Transport Reimbursement", currency_field="currency_id")
    accommodation = fields.Monetary(string="Accommodation", currency_field="currency_id")
    car_rental = fields.Monetary(string="Car Rental", currency_field="currency_id")
    total_amount = fields.Monetary(string="Total", currency_field="currency_id", compute="_compute_total", store=True)

    def _compute_total(self):
        for rec in self:
            rec.total_amount = rec.consultancy_fee + rec.salary_package + rec.per_diem + rec.mobile_allowance + rec.transport_reimbursement + rec.accommodation + rec.car_rental
