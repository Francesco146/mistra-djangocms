import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("appQuiz", "0005_givenanswer"),
    ]

    operations = [
        migrations.AlterField(
            model_name="givenanswer",
            name="answer",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="appQuiz.answer",
                null=True,
                blank=True,
            ),
        ),
    ]
