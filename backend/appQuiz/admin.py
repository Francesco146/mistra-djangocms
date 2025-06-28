from django.contrib import admin

from .models import (
    Answer,
    Category,
    GivenAnswer,
    Question,
    Sex,
    Test,
    TestExecution,
)


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1


class QuestionInline(admin.TabularInline):
    model = Test.questions.through
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ("questions",)


class GivenAnswerInline(admin.TabularInline):
    model = GivenAnswer
    extra = 0
    fields = ("question", "display_answer")
    readonly_fields = ("question", "display_answer")

    def display_answer(self, obj):
        return obj.answer.text if obj.answer else "Non ha risposto"

    display_answer.short_description = "Risposta"


@admin.register(TestExecution)
class TestExecutionAdmin(admin.ModelAdmin):
    list_display = ("id", "test", "age", "score", "IP", "duration", "execution_time")
    readonly_fields = ("execution_time",)
    inlines = [GivenAnswerInline]


@admin.register(Sex)
class SexAdmin(admin.ModelAdmin):
    pass
