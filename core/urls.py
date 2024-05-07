from django.urls import path
from .views import (IndexView,
                    ListaDespesasView,
                    MesView,
                    ConteudoView,
                    HeaderView,
                    deletar_despesa,
                    UpdateDespesaView,
                    # DespesaView,
                    DespesaPagaView, DespesaActionsView, AdicionarDespesaView
                    )

urlpatterns = [
    # Página inicial
    path('', IndexView.as_view(), name='index'),

    # Despesas
    path('actions/', DespesaActionsView.as_view(), name='actions'),
    path('despesas/', ListaDespesasView.as_view(), name='despesa_mensal'),
    path('mes/<str:nome_mes>/', MesView.as_view(), name='mes'),
    path('conteudo/<str:nome_mes>/', ConteudoView.as_view(), name='conteudo'),
    path('header/', HeaderView.as_view(), name='header'),
    path('<int:pk>/update/',  UpdateDespesaView.as_view(), name='editar_despesa'),
    path('deletar/<int:pk>/', deletar_despesa, name='deletar_despesa'),
    path('pagar/<int:pk>/', DespesaPagaView.as_view(), name='pagar_despesa'),
    path('adicionar_despesa/', AdicionarDespesaView.as_view(), name='adicionar_despesa'),
]
