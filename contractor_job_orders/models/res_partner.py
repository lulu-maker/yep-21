from odoo import fields, models


class ResPartner(models.Model):
    _inherit = "res.partner"

    nationality = fields.Char(string="Nationality")
    passport_number = fields.Char(string="Passport Number")
    passport_expiry_date = fields.Date(string="Passport Expiry Date")
    id_number = fields.Char(string="ID Number")
    bank_name = fields.Char(string="Bank Name")
    iban = fields.Char(string="IBAN")
    swift = fields.Char(string="SWIFT")
    beneficiary_name = fields.Char(string="Beneficiary Name")
    job_order_count = fields.Integer(compute="_compute_job_order_count")

    def _compute_job_order_count(self):
        grouped = self.env["contractor.job.order"].read_group(
            [("contractor_id", "in", self.ids)], ["contractor_id"], ["contractor_id"]
        )
        count_by_contractor = {item["contractor_id"][0]: item["contractor_id_count"] for item in grouped}
        for partner in self:
            partner.job_order_count = count_by_contractor.get(partner.id, 0)

    def action_view_job_orders(self):
        self.ensure_one()
        action = self.env.ref("contractor_job_orders.action_contractor_job_order").read()[0]
        action["domain"] = [("contractor_id", "=", self.id)]
        action["context"] = {"default_contractor_id": self.id}
        return action
