from django.db import models
from djangocms_text.fields import HTMLField
from django.core.exceptions import ValidationError


# Category (*id,nome)
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


# Question (*id,name,text,id_category)
class Question(models.Model):
    name = models.CharField(max_length=255)
    text = HTMLField()
    id_category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_category_name(self):
        return self.id_category.name

    get_category_name.short_description = "Category"


# Answer(*id,text,score,correction,id_question)
class Answer(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField()
    score = models.DecimalField(max_digits=3, decimal_places=2)  # da -1 a 1
    correction = models.TextField(blank=True)
    id_question = models.ForeignKey(
        Question, related_name="answers", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.name} ({self.id_question})"

    def get_question_name(self):
        return self.id_question.name

    get_question_name.short_description = "Question"

    def formatted_score(self):
        return f"{self.score:+.2f}"

    formatted_score.short_description = "Score"

    def clean(self):
        if not (-1 <= self.score <= 1):
            raise ValidationError(
                "Il punteggio (score) deve essere compreso tra -1 e 1."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# Test(*id,name,description,min_score)
class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    min_score = models.FloatField()
    questions = models.ManyToManyField(Question, related_name="tests")

    def __str__(self):
        return self.name

    def question_count(self):
        return self.questions.count()

    question_count.short_description = "Questions"


# Sex(*id,name)
class Sex(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    @classmethod
    def list_display(cls):
        return ("id", "name")


# TestExecution(*id,execution_time,age,id_sex,id_test,score,IP,duration,revision_date,note)
class TestExecution(models.Model):
    execution_time = models.DateTimeField(auto_now_add=True)
    age = models.PositiveIntegerField()
    sex = models.ForeignKey(Sex, on_delete=models.SET_NULL, null=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    IP = models.GenericIPAddressField()
    duration = models.FloatField(help_text="Tempo in minuti")
    revision_date = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.test} - {self.execution_time} ({self.IP})"

    def formatted_execution_time(self):
        return self.execution_time.strftime("%d/%m/%Y %H:%M")

    formatted_execution_time.short_description = "Execution Time"

    def score_formatted(self):
        return f"{self.score:.1f} / {self.test.min_score:.1f}"

    score_formatted.short_description = "Score"

    def duration_formatted(self):
        return f"{self.duration:.1f} min"

    duration_formatted.short_description = "Duration"

    def passed(self):
        return self.score >= self.test.min_score

    passed.boolean = True
    passed.short_description = "Passed"

    class Meta:
        ordering = ["-execution_time"]


# GivenAnswer(*id, id_test_execution, id_question, id_answer)
class GivenAnswer(models.Model):
    test_execution = models.ForeignKey(TestExecution, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.test_execution.id} - Q{self.question.id} → A{self.answer.id if self.answer else 'Non ha risposto'}"

    def get_test_name(self):
        return self.test_execution.test.name

    get_test_name.short_description = "Test"

    def get_question_name(self):
        return self.question.name

    get_question_name.short_description = "Question"

    def get_answer_name(self):
        return self.answer.name if self.answer else "No answer"

    get_answer_name.short_description = "Answer"

    def get_answer_score(self):
        return self.answer.score if self.answer else 0

    get_answer_score.short_description = "Score"

    class Meta:
        verbose_name = "Given Answer"
        verbose_name_plural = "Given Answers"
