from odoo import fields, models


class ProjectProject(models.Model):
    _inherit = "project.project"

    job_order_count = fields.Integer(compute="_compute_job_order_count")

    def _compute_job_order_count(self):
        grouped = self.env["contractor.job.order"].read_group(
            [("project_id", "in", self.ids)], ["project_id"], ["project_id"]
        )
        count_by_project = {item["project_id"][0]: item["project_id_count"] for item in grouped}
        for project in self:
            project.job_order_count = count_by_project.get(project.id, 0)

    def action_view_job_orders(self):
        self.ensure_one()
        action = self.env.ref("contractor_job_orders.action_contractor_job_order").read()[0]
        action["domain"] = [("project_id", "=", self.id)]
        action["context"] = {"default_project_id": self.id}
        return action
