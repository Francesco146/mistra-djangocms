from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from cms.models.pluginmodel import CMSPlugin


@plugin_pool.register_plugin
class QuizPlugin(CMSPluginBase):
    model = CMSPlugin
    module = "MISTRA"
    name = "Quiz"
    render_template = "quiz.html"
