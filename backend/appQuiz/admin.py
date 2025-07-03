from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db.models import Count, F
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
    autocomplete_fields = ["question"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ("id", "name", "get_category_name")
    list_display_links = ("id", "name")
    search_fields = ("name", "text", "id_category__name")
    list_filter = ("id_category",)
    ordering = ("name",)

    def get_category_name(self, obj):
        return obj.id_category.name

    get_category_name.short_description = "Category"
    get_category_name.admin_order_field = "id_category__name"


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    exclude = ("questions",)
    list_display = ("id", "name", "question_count", "min_score")
    list_display_links = ("id", "name")
    search_fields = ("name", "description")
    list_filter = ("min_score",)
    ordering = ("name",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(_question_count=Count("questions"))

    def question_count(self, obj):
        return obj.questions.count()

    question_count.short_description = "Questions"
    question_count.admin_order_field = "_question_count"


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
    list_display_links = ("id",)
    readonly_fields = ("execution_time",)
    inlines = [GivenAnswerInline]
    search_fields = ("test__name", "IP", "note")
    list_filter = ("test", "sex", "execution_time", PassedFilter)
    ordering = ("-execution_time",)
    date_hierarchy = "execution_time"

    def score_formatted(self, obj):
        return f"{obj.score:.1f} / {obj.test.min_score:.1f}"

    score_formatted.short_description = "Score"
    score_formatted.admin_order_field = "score"

    def duration_formatted(self, obj):
        return f"{obj.duration:.1f} min"

    duration_formatted.short_description = "Duration"
    duration_formatted.admin_order_field = "duration"

    def formatted_execution_time(self, obj):
        return obj.execution_time.strftime("%d/%m/%Y %H:%M")

    formatted_execution_time.short_description = "Execution Time"
    formatted_execution_time.admin_order_field = "execution_time"

    def passed(self, obj):
        return obj.score >= obj.test.min_score

    passed.boolean = True
    passed.short_description = "Passed"


@admin.register(Sex)
class SexAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "get_question_name", "formatted_score")
    list_display_links = ("id", "name")
    search_fields = ("name", "text", "id_question__name")
    list_filter = ("score", "id_question__id_category")
    ordering = ("id_question", "score")

    def get_question_name(self, obj):
        return obj.id_question.name

    get_question_name.short_description = "Question"
    get_question_name.admin_order_field = "id_question__name"

    def formatted_score(self, obj):
        return f"{obj.score:+.2f}"

    formatted_score.short_description = "Score"
    formatted_score.admin_order_field = "score"


@admin.register(GivenAnswer)
class GivenAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_test_name",
        "get_question_name",
        "get_answer_name",
        "get_answer_score",
    )
    list_display_links = ("id",)
    search_fields = ("test_execution__test__name", "question__name", "answer__name")
    list_filter = (
        "test_execution__test",
        "question__id_category",
        "test_execution__execution_time",
    )
    ordering = ("-test_execution__execution_time", "question")
    date_hierarchy = "test_execution__execution_time"

    def get_test_name(self, obj):
        return obj.test_execution.test.name

    get_test_name.short_description = "Test"
    get_test_name.admin_order_field = "test_execution__test__name"

    def get_question_name(self, obj):
        return obj.question.name

    get_question_name.short_description = "Question"
    get_question_name.admin_order_field = "question__name"

    def get_answer_name(self, obj):
        return obj.answer.name if obj.answer else "No answer"

    get_answer_name.short_description = "Answer"
    get_answer_name.admin_order_field = "answer__name"

    def get_answer_score(self, obj):
        return obj.answer.score if obj.answer else 0

    get_answer_score.short_description = "Score"
    get_answer_score.admin_order_field = "answer__score"
