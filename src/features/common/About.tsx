import { useStyletron } from 'baseui';

const About = () => {
  const [css] = useStyletron();
  return (
    <div>
      <h2>Egy szakácskönyv a családnak és a barátoknak</h2>
      <p>Amit kínálunk:</p>
      <ul>
        <li className={css({ marginBottom: '5px' })}>
          A családi receptek felvitele
        </li>
        <li className={css({ marginBottom: '5px' })}>
          A teljes családi szakácskönyv megosztása más családokkal
        </li>
        <li className={css({ marginBottom: '5px' })}>
          Váltás a családok között egy kattintással
        </li>
        <li className={css({ marginBottom: '5px' })}>
          Kommentek és értékelések
        </li>
        <li className={css({ marginBottom: '5px' })}>
          Magyar és angol felület
        </li>
      </ul>
      <p>
        Az app jelenleg Béta fázisban fut, meghívott felhasználók
        közreműködésével.
      </p>
      <p>
        Amennyiben kipróbálnád, kérlek vedd fel a kapcsolatot az adminnal az
        alábbi elérhetőségen:
      </p>
      <address>
        <a
          className={css({ color: '#000' })}
          href='mailto:cryptosmate@gmail.com'
        >
          Admin email
        </a>
      </address>
    </div>
  );
};

export default About;
