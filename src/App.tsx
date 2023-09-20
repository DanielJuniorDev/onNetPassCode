import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import systemsWithEmailData from "../src/json/systemsWithEmail.json";
import systemsWithUserData from "../src/json/systemsWithUser.json";
import masculinoImage from "../src/assets/masculino.png";
import femininoImage from "../src/assets/feminino.png";
import html2canvas from "html2canvas";
import styles from "./app.module.css";
import logo from "../src/assets/logo.png";
import hamster from "../src/json/passwords.json";

interface Systems {
  [key: string]: boolean;
}

function App() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState("");
  const [setor, setSetor] = useState("");
  const [sexo, setSexo] = useState("");
  const [emailSystems, setEmailSystems] = useState<Systems>({});
  const [noEmailSystems, setNoEmailSystems] = useState<Systems>({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [lista1, setLista1] = useState<string>("");
  const [lista2, setLista2] = useState<string>("");
  const [cardGerado, setCardGerado] = useState<boolean>(false);

  useEffect(() => {
    setCardGerado(false);
  }, [email, fullName, user, setor, sexo, emailSystems, noEmailSystems]);

  useEffect(() => {
    const initialSystemsWithEmail: Systems = {};
    systemsWithEmailData.systems.forEach((system: string) => {
      initialSystemsWithEmail[system] = false;
    });
    setEmailSystems(initialSystemsWithEmail);

    const initialSystemsWithoutEmail: Systems = {};
    systemsWithUserData.userSystems.forEach((system: string) => {
      initialSystemsWithoutEmail[system] = false;
    });
    setNoEmailSystems(initialSystemsWithoutEmail);
    setEmailSystems(initialSystemsWithEmail);
  }, []);

  const handleSystemChange = (systemName: string) => {
    setEmailSystems({
      ...emailSystems,
      [systemName]: !emailSystems[systemName],
    });
  };
  const handleUserSystemChange = (systemName: string) => {
    setNoEmailSystems({
      ...noEmailSystems,
      [systemName]: !noEmailSystems[systemName],
    });
  };

  const handleGeneratePasswordClick = () => {
    setCardGerado(true);

    const uppercaseLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 65
    );
    const lowercaseLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    );
    const number = Math.floor(Math.random() * 10);

    const passwordArray = [uppercaseLetter, lowercaseLetter, number];
    const remainingChars = Array.from({ length: 7 }, () => {
      const randomChar = String.fromCharCode(
        Math.floor(Math.random() * 26) + 97
      );
      return randomChar;
    });

    const password = [...passwordArray, ...remainingChars].join("");
    const passwordWithAsterisk =
      password.substring(0, password.length - 1) + "*";
    setGeneratedPassword(passwordWithAsterisk);

    const selectedEmailSystems = Object.keys(emailSystems).filter(
      (system) => emailSystems[system]
    );

    const selectedNoEmailSystems = Object.keys(noEmailSystems).filter(
      (userSystem) => noEmailSystems[userSystem]
    );

    const lista1String = selectedEmailSystems.join(", ");
    const lista2String = selectedNoEmailSystems.join(", ");

    setLista1(lista1String);
    setLista2(lista2String);
  };

  const handleSaveAsPNG = () => {
    const card = document.querySelector(`.${styles.shareCard}`) as HTMLElement;
    const parentElement = document.querySelector(
      `.${styles.shareCardDiv}`
    ) as HTMLElement;

    if (card && parentElement) {
      // Salve o estilo atual
      const originalParentStyle = parentElement.style.cssText;
      const originalStyle = card.style.cssText;

      // Aumente a escala para melhorar a resolução
      const scale = 2; // Ajuste esse valor conforme necessário

      card.style.transform = `scale(${scale})`;
      card.style.transformOrigin = "top left";

      html2canvas(card, { scale }).then((canvas) => {
        // Restaure o estilo original
        card.style.cssText = originalStyle;
        parentElement.style.cssText = originalParentStyle;

        const link = document.createElement("a");
        link.download = "card.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const handleCopyText = () => {
    // Crie um array para armazenar os sistemas marcados
    const selectedSystems: string[] = [];
    const selectedSystemsNoEmail: string[] = [];
    // Verifique e adicione sistemas de e-mail marcados
    Object.keys(emailSystems).forEach((system) => {
      if (emailSystems[system]) {
        selectedSystems.push(system);
      }
    });

    // Verifique e adicione sistemas de não e-mail marcados
    Object.keys(noEmailSystems).forEach((userSystem) => {
      if (noEmailSystems[userSystem]) {
        selectedSystemsNoEmail.push(userSystem);
      }
    });

    // Combine as informações e adicione quebras de linha conforme necessário
    const cardText = `
  Nome do Colaborador: ${fullName}
  Setor do Colaborador: ${setor}
  
  Sistemas:
  ${selectedSystems}
  
  Email:${email}
  Senha Gerada: ${generatedPassword}
  ------------------------------------
  ${selectedSystemsNoEmail}

  Usuário:${user}
  Senha Gerada: ${generatedPassword}
  `;

    // Crie um elemento textarea e copie o texto formatado para ele
    const textArea = document.createElement("textarea");
    textArea.value = cardText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert("Texto copiado para a área de transferência.");
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.titleMain}>
          <h1 className={styles.title}>Gerenciador de credenciais</h1>
          <h3 className={styles.subtitle}> Desenvolvimento - OnNet Telecom</h3>
        </div>
        <div className={styles.form}>
          <div className={styles.coletaDados}>
            <div className={styles.formInput}>
              <span>Email do Colaborador:</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email do colaborador"
              />
            </div>

            <div className={styles.sexo}>
              <span>Sexo:</span>
              <div className={styles.sexoInput}>
                <div>
                  <input
                    type="radio"
                    name="sexo"
                    value="Masculino"
                    checked={sexo === "Masculino"}
                    onChange={() => setSexo("Masculino")}
                  />{" "}
                  <span>Masculino</span>
                </div>

                <div>
                  <input
                    type="radio"
                    name="sexo"
                    value="Feminino"
                    checked={sexo === "Feminino"}
                    onChange={() => setSexo("Feminino")}
                  />{" "}
                  <span>Feminino</span>
                </div>
              </div>
            </div>

            <div className={styles.formInput}>
              <span>Usuário MK:</span>

              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Digite o Usuário Mk"
              />
            </div>

            <div className={styles.formInput}>
              <span>Nome Completo do Colaborador:</span>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Digite o Nome do Colaborador"
              />
            </div>
            <div className={styles.formInput}>
              <span>Setor do Colaborador:</span>

              <input
                type="text"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                placeholder="Digite o setor do colaborador"
              />
            </div>
            <br />
          </div>
          <div className={styles.tabelaDiv}>
            <span>Sistemas:</span>

            <table>
              <thead>
                <tr>
                  <th>
                    <span>Sistema</span>
                  </th>
                  <th>
                    <span>Selecionar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(emailSystems).map((system) => (
                  <tr key={system}>
                    <td>{system}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={emailSystems[system]}
                        onChange={() => handleSystemChange(system)}
                      />
                    </td>
                  </tr>
                ))}

                {Object.keys(noEmailSystems).map((userSystem) => (
                  <tr key={userSystem}>
                    <td>{userSystem}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={noEmailSystems[userSystem]}
                        onChange={() => handleUserSystemChange(userSystem)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <button
            onClick={handleGeneratePasswordClick}
            className={styles.button}
          >
            Gerar Senha
          </button>
          <p>Senha Gerada: {generatedPassword}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.logodiv}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.shareCardDiv}>
          {cardGerado ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <span className={styles.shareCard}>
                <div className={styles.identification}>
                  <img
                    src={sexo === "Masculino" ? masculinoImage : femininoImage}
                    alt={sexo}
                    className={styles.sexoImage}
                  />
                  <div className={styles.identificationText}>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {fullName}
                    </span>
                    <span style={{ fontSize: "14px" }}>{setor}</span>
                  </div>
                </div>
                <div>
                  <div>
                    <hr />
                    {lista1 ? (
                      <>
                        <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {lista1}
                        </p>
                        <br />
                        <p style={{ fontSize: "14px" }}>Email: {email}</p>
                        <p style={{ fontSize: "14px" }}>
                          Senha: {generatedPassword}
                        </p>

                        <hr />
                      </>
                    ) : null}

                    {lista2 ? (
                      <>
                        <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {lista2}
                        </p>
                        <br />
                        <p style={{ fontSize: "14px" }}>Usuário: {user}</p>
                        <p style={{ fontSize: "14px" }}>
                          Senha: {generatedPassword}
                        </p>
                        <hr />
                      </>
                    ) : null}
                  </div>
                </div>
                <img src={logo} alt="" className={styles.logoSmall} />
              </span>
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  width: "70%",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={handleSaveAsPNG}
                  className={styles.buttonGenerate}
                >
                  Salvar como PNG
                </button>
                <button
                  onClick={handleCopyText}
                  className={styles.buttonGenerate}
                >
                  Copiar Texto do Card
                </button>
              </div>
            </div>
          ) : (
            <Lottie animationData={hamster} height={100} width={100} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
