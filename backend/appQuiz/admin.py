from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db.models import F
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


class PassedFilter(admin.SimpleListFilter):
    title = "passed status"
    parameter_name = "passed"

    def lookups(self, request, model_admin):
        return (
            ("yes", "Passed"),
            ("no", "Not Passed"),
        )

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(score__gte=F("test__min_score"))
        if self.value() == "no":
            return queryset.filter(score__lt=F("test__min_score"))
        return queryset


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
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ("id", "name", "get_category_name")
    search_fields = ("name", "text", "id_category__name")
    list_filter = ("id_category",)
    ordering = ("name",)


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ("questions",)
    list_display = ("id", "name", "question_count", "min_score")
    search_fields = ("name", "description")
    list_filter = ("min_score",)
    ordering = ("name",)


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
        "sex",
        "score_formatted",
        "IP",
        "duration_formatted",
        "formatted_execution_time",
        "passed",
    )
    readonly_fields = ("execution_time",)
    inlines = [GivenAnswerInline]
    search_fields = ("test__name", "IP", "note")
    list_filter = ("test", "sex", "execution_time", PassedFilter)
    ordering = ("-execution_time",)
    date_hierarchy = "execution_time"


@admin.register(Sex)
class SexAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "get_question_name", "formatted_score")
    search_fields = ("name", "text", "id_question__name")
    list_filter = ("score", "id_question__id_category")
    ordering = ("id_question", "score")


@admin.register(GivenAnswer)
class GivenAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_test_name",
        "get_question_name",
        "get_answer_name",
        "get_answer_score",
    )
    search_fields = ("test_execution__test__name", "question__name", "answer__name")
    list_filter = (
        "test_execution__test",
        "question__id_category",
        "test_execution__execution_time",
    )
    ordering = ("-test_execution__execution_time", "question")
    date_hierarchy = "test_execution__execution_time"
