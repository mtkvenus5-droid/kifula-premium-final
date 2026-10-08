import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { QRCodeSVG } from 'qrcode.react'

type School = {
  id: number
  name: string
  province: string
  municipality: string
  type: string
  level: string
  city: string
  color: string
}

type Theme = {
  id: number
  title: string
  school: string
  discipline: string
  province: string
  level: string
  type: string
  premium: boolean
  description: string
  className: string
  year: string
}

type Plan = {
  id: number
  name: string
  price: string
  description: string
  features: string[]
  recommended?: boolean
}

const schools: School[] = [
  { id: 1, name: 'Colégio Politécnico The Vision', province: 'Luanda', municipality: 'Viana', type: 'Privado', level: 'Secundário', city: 'Luanda', color: '#4f46e5' },
  { id: 2, name: 'Escola Secundária 11 de Novembro', province: 'Luanda', municipality: 'Ingombota', type: 'Público', level: 'Secundário', city: 'Luanda', color: '#0f766e' },
  { id: 3, name: 'Escola Secundária de Benguela', province: 'Benguela', municipality: 'Benguela', type: 'Público', level: 'Secundário', city: 'Benguela', color: '#f59e0b' },
  { id: 4, name: 'Escola Secundária de Huambo', province: 'Huambo', municipality: 'Huambo', type: 'Público', level: 'Secundário', city: 'Huambo', color: '#ef4444' },
  { id: 5, name: 'Escola Secundária de Cabinda', province: 'Cabinda', municipality: 'Cabinda', type: 'Público', level: 'Secundário', city: 'Cabinda', color: '#22c55e' },
  { id: 6, name: 'Complexo Escolar de Talatona', province: 'Luanda', municipality: 'Talatona', type: 'Público', level: 'Secundário', city: 'Luanda', color: '#0ea5e9' },
  { id: 7, name: 'Instituto Superior de Ciências da Educação', province: 'Luanda', municipality: 'Maianga', type: 'Público', level: 'Superior', city: 'Luanda', color: '#7c3aed' },
  { id: 8, name: 'Escola de Ciências e Tecnologia', province: 'Luanda', municipality: 'Samba', type: 'Privado', level: 'Técnico', city: 'Luanda', color: '#e11d48' },
  { id: 9, name: 'Colégio Nossa Senhora da Conceição', province: 'Luanda', municipality: 'Benfica', type: 'Privado', level: 'Secundário', city: 'Luanda', color: '#f97316' },
  { id: 10, name: 'Escola de Formação Técnica de Luanda', province: 'Luanda', municipality: 'Cacuaco', type: 'Público', level: 'Técnico', city: 'Luanda', color: '#10b981' },
  { id: 11, name: 'Instituto Politécnico de Angola', province: 'Luanda', municipality: 'Kilamba Kiaxi', type: 'Público', level: 'Técnico', city: 'Luanda', color: '#14b8a6' },
  { id: 12, name: 'Liceu de Luanda', province: 'Luanda', municipality: 'Luanda', type: 'Público', level: 'Secundário', city: 'Luanda', color: '#f43f5e' },
  { id: 13, name: 'Escola de Comércio e Gestão de Luanda', province: 'Luanda', municipality: 'Luanda', type: 'Privado', level: 'Técnico', city: 'Luanda', color: '#a855f7' },
  { id: 14, name: 'Colégio de Aplicação do ISCED', province: 'Luanda', municipality: 'Maianga', type: 'Público', level: 'Secundário', city: 'Luanda', color: '#2563eb' },
  { id: 15, name: 'Escola Secundária de Lobito', province: 'Benguela', municipality: 'Lobito', type: 'Público', level: 'Secundário', city: 'Lobito', color: '#facc15' },
  { id: 16, name: 'Escola Secundária de Malanje', province: 'Malanje', municipality: 'Malanje', type: 'Público', level: 'Secundário', city: 'Malanje', color: '#3b82f6' },
  { id: 17, name: 'Escola Secundária de Namibe', province: 'Namibe', municipality: 'Namibe', type: 'Público', level: 'Secundário', city: 'Namibe', color: '#06b6d4' },
  { id: 18, name: 'Escola Secundária de Uíge', province: 'Uíge', municipality: 'Uíge', type: 'Público', level: 'Secundário', city: 'Uíge', color: '#fb7185' },
  { id: 19, name: 'Escola Secundária de Zaire', province: 'Zaire', municipality: 'Mbanza Congo', type: 'Público', level: 'Secundário', city: 'Mbanza Congo', color: '#84cc16' },
  { id: 20, name: 'Escola Secundária de Bié', province: 'Bié', municipality: 'Kuito', type: 'Público', level: 'Secundário', city: 'Kuito', color: '#f97316' },
]

const disciplines = ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Inglês', 'Informática', 'Economia', 'Educação Física', 'Literatura']

const themes: Theme[] = [
  { id: 1, title: 'A importância da tecnologia na educação', school: 'Colégio Politécnico The Vision', discipline: 'Informática', province: 'Luanda', level: '12ª Classe', type: 'Privado', premium: false, description: 'Tema moderno com foco em inovação digital e aprendizagem.', className: '12ª', year: '2025' },
  { id: 2, title: 'Desafios ambientais em Luanda', school: 'Escola Secundária 11 de Novembro', discipline: 'Geografia', province: 'Luanda', level: '11ª Classe', type: 'Público', premium: true, description: 'Leitura crítica sobre urbanização e sustentabilidade.', className: '11ª', year: '2025' },
  { id: 3, title: 'A energia renovável e o futuro do país', school: 'Escola Secundária de Benguela', discipline: 'Física', province: 'Benguela', level: '12ª Classe', type: 'Público', premium: false, description: 'Tema experimental com aplicabilidade económica e ecológica.', className: '12ª', year: '2025' },
  { id: 4, title: 'O papel da educação no desenvolvimento social', school: 'Instituto Superior de Ciências da Educação', discipline: 'História', province: 'Luanda', level: '11ª Classe', type: 'Público', premium: true, description: 'Aprofundamento histórico e pedagógico.', className: '11ª', year: '2025' },
  { id: 5, title: 'Matemática financeira para jovens', school: 'Escola de Ciências e Tecnologia', discipline: 'Matemática', province: 'Luanda', level: '12ª Classe', type: 'Privado', premium: false, description: 'Aplicações práticas do cálculo financeiro.', className: '12ª', year: '2025' },
  { id: 6, title: 'A influência da cultura angolana na literatura', school: 'Colégio Nossa Senhora da Conceição', discipline: 'Literatura', province: 'Luanda', level: '12ª Classe', type: 'Privado', premium: true, description: 'Tema voltado para análise literária, cultura e identidade.', className: '12ª', year: '2025' },
  { id: 7, title: 'Importância da saúde pública no desenvolvimento', school: 'Escola de Formação Técnica de Luanda', discipline: 'Biologia', province: 'Luanda', level: '10ª Classe', type: 'Técnico', premium: false, description: 'Exploração dos fatores de saúde e prevenção.', className: '10ª', year: '2025' },
  { id: 8, title: 'A revolução digital e suas implicações económicas', school: 'Instituto Politécnico de Angola', discipline: 'Economia', province: 'Luanda', level: '12ª Classe', type: 'Técnico', premium: true, description: 'Tema sobre transformação tecnológica e mercado de trabalho.', className: '12ª', year: '2025' },
]

const plans: Plan[] = [
  { id: 1, name: 'Básico', price: 'Grátis', description: 'Pesquisa simples e até 1 trabalho', features: ['1 tema grátis', 'Busca básica', 'Exportação simples'] },
  { id: 2, name: 'Estudante', price: '4.500 Kz/mês', description: 'Para alunos em crescimento', features: ['Todos os temas básicos', '5 PDFs/mês', 'Uso de 3 templates'], recommended: true },
  { id: 3, name: 'Premium', price: '9.500 Kz/mês', description: 'Para trabalhos completos e profissionais', features: ['Temas premium ilimitados', 'PDF completo', 'QR Code e assinatura', 'Suporte prioritário'] },
  { id: 4, name: 'Instituição', price: '29.500 Kz/mês', description: 'Para escolas e professores', features: ['Múltiplos usuários', 'Biblioteca institucional', 'Geração em lote'] },
]

const paymentMethods = ['M-Pesa', 'Transferência Bancária', 'Moedim', 'E-Mola', 'Cartão']

const provinceList = ['Todos', ...new Set(schools.map((school) => school.province))]
const typeList = ['Todos', ...new Set(schools.map((school) => school.type))]

function buildSchoolBadge(name: string, color: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="220" height="220" rx="24" fill="url(#g)"/>
      <circle cx="110" cy="80" r="46" fill="rgba(255,255,255,0.14)"/>
      <text x="110" y="120" font-size="44" font-family="Arial,sans-serif" fill="white" text-anchor="middle" font-weight="700">${initials}</text>
      <text x="110" y="172" font-size="12" font-family="Arial,sans-serif" fill="rgba(255,255,255,0.8)" text-anchor="middle">${name.slice(0, 18)}</text>
    </svg>
  `)}`
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('Todos')
  const [selectedType, setSelectedType] = useState('Todos')
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todos')
  const [selectedSchool, setSelectedSchool] = useState<School>(schools[0])
  const [credits, setCredits] = useState(18)

  const [form, setForm] = useState({
    title: 'Impacto da tecnologia na educação',
    studentName: 'João Pedro',
    discipline: 'Informática',
    schoolName: schools[0].name,
    classLevel: '12ª Classe',
    teacherName: 'Prof. Ana Soares',
    summary: 'O trabalho analisa como a tecnologia melhora a aprendizagem, a organização do estudo e o desempenho escolar em Angola.',
    conclusion: 'Conclui-se que a integração digital é essencial para um ensino moderno, inclusivo e eficiente.',
  })

  const filteredThemes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return themes.filter((theme) => {
      const matchesSearch =
        query.length === 0 ||
        theme.title.toLowerCase().includes(query) ||
        theme.school.toLowerCase().includes(query) ||
        theme.discipline.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query)

      const matchesProvince = selectedProvince === 'Todos' || theme.province === selectedProvince
      const matchesType = selectedType === 'Todos' || theme.type === selectedType
      const matchesDiscipline = selectedDiscipline === 'Todos' || theme.discipline === selectedDiscipline

      return matchesSearch && matchesProvince && matchesType && matchesDiscipline
    })
  }, [searchTerm, selectedProvince, selectedType, selectedDiscipline])

  const applyTheme = (theme: Theme) => {
    const school = schools.find((item) => item.name === theme.school) ?? schools[0]
    setSelectedSchool(school)
    setForm((prev) => ({
      ...prev,
      title: theme.title,
      discipline: theme.discipline,
      schoolName: school.name,
      classLevel: theme.level,
      summary: `Tema selecionado: ${theme.description}`,
    }))
  }

  const useCredits = (value: number) => {
    setCredits((prev) => Math.max(0, prev - value))
  }

  const generatePdf = () => {
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      doc.setFillColor(13, 41, 77)
      doc.rect(0, 0, pageWidth, 54, 'F')

      const badge = buildSchoolBadge(selectedSchool.name, selectedSchool.color)
      try {
        doc.addImage(badge, 'PNG', 18, 18, 26, 26)
      } catch (e) {
        console.warn('Erro ao adicionar imagem do badge:', e)
      }

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.text('KIFULA PREMIUM', 52, 28)
      doc.setFontSize(11)
      doc.text('Sistema de geração e validação de trabalho escolar', 52, 36)
      doc.text(selectedSchool.name, 52, 44)

      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(0.4)
      doc.line(18, 58, pageWidth - 18, 58)

      doc.setTextColor(17, 24, 39)
      doc.setFontSize(18)
      doc.text(form.title, 18, 74)
      doc.setFontSize(11)
      doc.text(`Aluno: ${form.studentName}`, 18, 87)
      doc.text(`Disciplina: ${form.discipline}`, 18, 94)
      doc.text(`Classe: ${form.classLevel}`, 18, 101)
      doc.text(`Escola: ${form.schoolName}`, 18, 108)
      doc.text(`Professor(a): ${form.teacherName}`, 18, 115)

      const introText = doc.splitTextToSize(form.summary, 160)
      doc.text(introText, 18, 130)

      doc.setFontSize(13)
      doc.text('Introdução', 18, 150)
      doc.setFontSize(11)
      const introBody = doc.splitTextToSize('Neste trabalho, será apresentado um estudo crítico com foco em contextualização, objetivos, desenvolvimento e conclusões relevantes para o tema escolhido.', 160)
      doc.text(introBody, 18, 158)

      doc.setFontSize(13)
      doc.text('Desenvolvimento', 18, 182)
      doc.setFontSize(11)
      const devBody = doc.splitTextToSize('O tema ressalta a importância da interação entre teoria e prática, destacando a relevância do contexto escolar angolano, os desafios reais de implementação e as soluções adequadas para uma educação mais eficaz.', 160)
      doc.text(devBody, 18, 190)

      doc.setFontSize(13)
      doc.text('Conclusão', 18, 228)
      doc.setFontSize(11)
      const conclusionBody = doc.splitTextToSize(form.conclusion, 160)
      doc.text(conclusionBody, 18, 236)

      doc.setFillColor(240, 244, 248)
      doc.roundedRect(18, 260, 72, 18, 4, 4, 'F')
      doc.setTextColor(17, 24, 39)
      doc.text('Validado por QR', 30, 272)
      doc.setTextColor(17, 24, 39)
      doc.setFontSize(10)
      doc.text('Documento gerado pela plataforma Kifula Premium', 18, pageHeight - 20)

      doc.save(`${form.title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
      useCredits(5)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar o PDF. Tente novamente.')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">K</div>
          <div>
            <p className="brand-name">Kifula</p>
            <small>Premium</small>
          </div>
        </div>

        <nav className="nav">
          <a href="#biblioteca">Biblioteca</a>
          <a href="#gerador">Gerador</a>
          <a href="#premium">Premium</a>
          <a href="#pagamentos">Pagamentos</a>
        </nav>

        <button className="primary-btn">Entrar</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Trabalhos escolares premium</span>
            <h1>Crie trabalhos escolares profissionais em Angola.</h1>
            <p>
              Pesquise temas, escolha a sua escola, aplique filtros por disciplina, província e tipo de ensino,
              e gere o PDF final com capa, validação e design premium.
            </p>
            <div className="hero-actions">
              <button className="primary-btn">Começar agora</button>
              <button className="secondary-btn">Ver biblioteca</button>
            </div>
            <div className="stats-grid">
              <div><strong>40+</strong><span>disciplines</span></div>
              <div><strong>100+</strong><span>temas</span></div>
              <div><strong>20+</strong><span>escolas</span></div>
            </div>
          </div>

          <div className="hero-card panel">
            <div className="mini-header">
              <span className="status-dot" />
              <span>Live Preview</span>
            </div>

            <div className="preview-cover">
              <img src={buildSchoolBadge(selectedSchool.name, selectedSchool.color)} alt={selectedSchool.name} />
              <div>
                <small>{selectedSchool.province}</small>
                <h3>{form.title}</h3>
                <p>{form.studentName}</p>
              </div>
            </div>

            <div className="preview-qr">
              <QRCodeSVG value={`kifula://${selectedSchool.name}:${form.title}`} size={74} />
              <div>
                <strong>Validação</strong>
                <span>QR ativo</span>
              </div>
            </div>
          </div>
        </section>

        <section id="biblioteca" className="library-section panel">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">Biblioteca inteligente</span>
              <h2>Pesquisa premium de temas</h2>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Pesquisar tema, escola ou disciplina"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="filters-grid">
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
              {provinceList.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {typeList.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select value={selectedDiscipline} onChange={(e) => setSelectedDiscipline(e.target.value)}>
              <option value="Todos">Todas as disciplinas</option>
              {disciplines.map((discipline) => (
                <option key={discipline} value={discipline}>{discipline}</option>
              ))}
            </select>
          </div>

          <div className="card-grid">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => (
                <article key={theme.id} className="theme-card">
                  <div className="theme-tag-row">
                    <span className={`tag ${theme.premium ? 'premium' : 'free'}`}>{theme.premium ? 'Premium' : 'Grátis'}</span>
                    <span className="tag neutral">{theme.province}</span>
                  </div>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                  <div className="meta-row">
                    <span>{theme.school}</span>
                    <span>{theme.discipline}</span>
                  </div>
                  <div className="meta-row small">
                    <span>{theme.className}</span>
                    <span>{theme.type}</span>
                  </div>
                  <button className="secondary-btn full" onClick={() => applyTheme(theme)}>
                    Usar tema
                  </button>
                </article>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#cbd5e1' }}>
                <p>Nenhum tema encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </section>

        <section id="gerador" className="generator-grid">
          <div className="panel form-panel">
            <span className="eyebrow">Gerador de trabalho</span>
            <h2>Criar documento</h2>

            <div className="form-grid">
              <label>
                Título do trabalho
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>

              <label>
                Nome do aluno
                <input value={form.studentName} onChange={(event) => setForm({ ...form, studentName: event.target.value })} />
              </label>

              <label>
                Disciplina
                <select value={form.discipline} onChange={(event) => setForm({ ...form, discipline: event.target.value })}>
                  {disciplines.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Classe
                <input value={form.classLevel} onChange={(event) => setForm({ ...form, classLevel: event.target.value })} />
              </label>

              <label>
                Escola
                <select value={selectedSchool.name} onChange={(event) => {
                  const school = schools.find((item) => item.name === event.target.value) ?? schools[0]
                  setSelectedSchool(school)
                  setForm({ ...form, schoolName: school.name })
                }}>
                  {schools.map((school) => (
                    <option key={school.id} value={school.name}>{school.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Professor(a)
                <input value={form.teacherName} onChange={(event) => setForm({ ...form, teacherName: event.target.value })} />
              </label>

              <label className="full-width">
                Resumo do trabalho
                <textarea rows={4} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
              </label>

              <label className="full-width">
                Conclusão
                <textarea rows={3} value={form.conclusion} onChange={(event) => setForm({ ...form, conclusion: event.target.value })} />
              </label>
            </div>

            <div className="action-group">
              <button className="primary-btn" onClick={generatePdf}>Gerar PDF completo</button>
              <button className="secondary-btn" onClick={() => useCredits(2)}>Usar 2 créditos</button>
            </div>
          </div>

          <div className="panel preview-panel">
            <span className="eyebrow">Preview</span>
            <h2>Resumo do trabalho</h2>

            <div className="preview-document">
              <div className="doc-header">
                <img src={buildSchoolBadge(selectedSchool.name, selectedSchool.color)} alt="logo" />
                <div>
                  <strong>{selectedSchool.name}</strong>
                  <small>{selectedSchool.province} • {selectedSchool.type}</small>
                </div>
              </div>

              <h3>{form.title}</h3>
              <ul>
                <li><span>Aluno</span> <strong>{form.studentName}</strong></li>
                <li><span>Disciplina</span> <strong>{form.discipline}</strong></li>
                <li><span>Classe</span> <strong>{form.classLevel}</strong></li>
                <li><span>Professor</span> <strong>{form.teacherName}</strong></li>
              </ul>

              <div className="preview-body">
                <p>{form.summary}</p>
              </div>

              <div className="qr-inline">
                <QRCodeSVG value={`kifula://validacao/${selectedSchool.name}/${form.title}`} size={80} />
                <span>Documento validado</span>
              </div>
            </div>
          </div>
        </section>

        <section id="premium" className="premium-section panel">
          <span className="eyebrow">Modelo premium</span>
          <h2>Escolha o plano ideal</h2>
          <div className="plans-grid">
            {plans.map((plan) => (
              <article key={plan.id} className={`plan-card ${plan.recommended ? 'featured' : ''}`}>
                {plan.recommended && <span className="best-badge">Mais usado</span>}
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className="secondary-btn full">Selecionar</button>
              </article>
            ))}
          </div>
        </section>

        <section id="pagamentos" className="payments-section panel">
          <div className="payments-header">
            <div>
              <span className="eyebrow">Pagamentos e créditos</span>
              <h2>Créditos e sistema premium</h2>
            </div>
            <div className="credit-box">
              <strong>{credits}</strong>
              <span>créditos</span>
            </div>
          </div>

          <div className="payment-layout">
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button key={method} className="method-btn">{method}</button>
              ))}
            </div>

            <div className="credit-packs">
              <button onClick={() => setCredits((prev) => prev + 10)}>+10 créditos</button>
              <button onClick={() => setCredits((prev) => prev + 50)}>+50 créditos</button>
              <button onClick={() => setCredits((prev) => prev + 100)}>+100 créditos</button>
              <button onClick={() => setCredits((prev) => prev + 200)}>+200 créditos</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Kifula Premium • Trabalhos escolares em Angola</p>
      </footer>
    </div>
  )
}

export default App
