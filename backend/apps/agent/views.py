from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .rag import answer_question


class AskView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response({'error': 'Question is required.'}, status=status.HTTP_400_BAD_REQUEST)
        result = answer_question(question)
        return Response(result)
