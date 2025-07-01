from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import BaseInlineFormSet

from .models import (
    Answer,
    Category,
    GivenAnswer,
    Question,
    Sex,
    Test,
    TestExecution,
)


class AnswerInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if any(self.errors):
            return

        has_correct_answer = False
        for form in self.forms:
            if not form.cleaned_data:
                # skip empty forms
                continue
            if form.cleaned_data.get("DELETE", False):
                # skip deleted forms
                continue
            score = form.cleaned_data.get("score")
            if score == 1:
                has_correct_answer = True
                break

        if not has_correct_answer:
            raise ValidationError("Almeno una risposta deve avere score = 1.")


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 1
    formset = AnswerInlineFormSet


class QuestionInline(admin.TabularInline):
    model = Test.questions.through
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ("id", "name", "get_category_name")


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ("questions",)
    list_display = ("id", "name", "question_count")


class GivenAnswerInline(admin.TabularInline):
    model = GivenAnswer
    extra = 0
    fields = ("get_question_name", "display_answer")
    readonly_fields = ("get_question_name", "display_answer")

    def display_answer(self, obj):
        return obj.answer.text if obj.answer else "Non ha risposto"

    display_answer.short_description = "Risposta"


@admin.register(TestExecution)
class TestExecutionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "test",
        "age",
        "score_formatted",
        "IP",
        "duration_formatted",
        "formatted_execution_time",
        "passed",
    )
    readonly_fields = ("execution_time",)
    inlines = [GivenAnswerInline]


@admin.register(Sex)
class SexAdmin(admin.ModelAdmin):
    pass
